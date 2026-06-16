import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CulqiService } from './culqi.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { getOfficialPrice } from './catalog';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private culqi: CulqiService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El pedido no tiene productos');
    }

    // Recalcula el total con precios OFICIALES del servidor (anti-manipulación)
    let totalCents = 0;
    const validatedItems = dto.items.map((i) => {
      const price = getOfficialPrice(i.productId, i.sizeId);
      if (price === null) {
        throw new BadRequestException(
          `Producto inválido (id ${i.productId}, ${i.sizeId})`,
        );
      }
      const qty = Math.max(1, Math.floor(i.qty));
      totalCents += Math.round(price * 100) * qty;
      return {
        productId: i.productId,
        sizeId: i.sizeId,
        name: i.name,
        qty,
        price,
      };
    });

    if (totalCents <= 0) {
      throw new BadRequestException('Total inválido');
    }

    const charge = await this.culqi.createCharge({
      amount: totalCents,
      currency: 'PEN',
      email: dto.email,
      sourceId: dto.culqiToken,
      description: `Pedido NUDA KETO — ${validatedItems.length} producto(s)`,
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        culqiCharge: charge.id,
        email: dto.email,
        totalCents,
        items: { create: validatedItems },
      },
      include: { items: true },
    });

    return {
      orderId: order.id,
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
    };
  }

  findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Todos los pedidos (panel de administración)
  findAllForAdmin() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
