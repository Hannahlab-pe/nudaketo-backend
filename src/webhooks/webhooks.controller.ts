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

    // Buscar si ya existe por odooId
    const existing = await this.prisma.product.findFirst({
      where: { odooId: body.id },
      include: { sizes: true },
    });

    const stock = body.qty_available != null ? Math.max(0, Math.floor(body.qty_available)) : null;

    if (existing) {
      // Actualizar stock y nombre
      await this.prisma.product.update({
        where: { id: existing.id },
        data: {
          name: body.name,
          stock,
        },
      });
      this.logger.log(`Producto Odoo #${body.id} actualizado en BD local`);
      return { ok: true, action: 'updated', productId: existing.id };
    }

    // Crear producto nuevo (sin publicar, el equipo lo completa en el panel)
    const slug = this.toSlug(body.name);
    const safeSlug = await this.uniqueSlug(slug);

    const created = await this.prisma.product.create({
      data: {
        odooId: body.id,
        name: body.name,
        slug: safeSlug,
        category: 'general',
        tagline: '',
        image: '',
        imageDetail: '',
        shortDesc: '',
        description: '',
        highlights: [],
        packaging: '',
        accentClass: 'text-nk-gold',
        btnClass: 'bg-nk-choco text-nk-ivory',
        cardBg: 'bg-nk-ivory',
        stock,
        active: false, // no visible en tienda hasta que el equipo complete los datos
        sizes: {
          create: (body.variants ?? []).map((v, i) => ({
            sizeKey: v.default_code?.split('-').pop() ?? `v${i}`,
            label: v.combination_name ?? `Variante ${i + 1}`,
            size: v.combination_name ?? '',
            pieces: '',
            price: v.lst_price ?? body.list_price ?? 0,
            sortOrder: i,
          })),
        },
      },
    });

    this.logger.log(`Producto Odoo #${body.id} creado en BD local como id ${created.id}`);
    return { ok: true, action: 'created', productId: created.id };
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
