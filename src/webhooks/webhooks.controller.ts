import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface OdooProductWebhook {
  id: number;
  name: string;
  list_price: number;
  qty_available: number;
  image_1920?: string | null;
  variants?: {
    id: number;
    default_code: string;
    combination_name: string;
    lst_price: number;
    qty_available: number;
  }[];
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Post('odoo/product')
  async odooProduct(
    @Headers('x-odoo-secret') secret: string,
    @Body() body: OdooProductWebhook,
  ) {
    const expected = this.config.get('ODOO_WEBHOOK_SECRET');
    if (expected && secret !== expected) {
      throw new UnauthorizedException('Secret inválido');
    }

    if (!body?.id || !body?.name) {
      return { ok: false, reason: 'Payload inválido' };
    }

    const stock = body.qty_available != null ? Math.max(0, Math.floor(body.qty_available)) : null;

    const existing = await this.prisma.product.findFirst({
      where: { odooId: body.id },
    });

    if (existing) {
      await this.prisma.product.update({
        where: { id: existing.id },
        data: { stock },
      });
      this.logger.log(`Producto Odoo #${body.id} actualizado (id=${existing.id}, stock=${stock})`);
      return { ok: true, productId: existing.id };
    }

    this.logger.warn(`Producto Odoo #${body.id} "${body.name}" sin odooId en BD, se omite`);
    return { ok: false, reason: 'Sin odooId' };
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async uniqueSlug(base: string): Promise<string> {
    let slug = base;
    let i = 1;
    while (await this.prisma.product.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }
}
