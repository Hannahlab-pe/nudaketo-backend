import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CulqiService } from './culqi.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private culqi: CulqiService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const charge = await this.culqi.createCharge({
      amount: dto.totalCents,
      currency: 'PEN',
      email: dto.email,
      sourceId: dto.culqiToken,
      description: `Pedido NUDA KETO — ${dto.items.length} producto(s)`,
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        culqiCharge: charge.id,
        email: dto.email,
        totalCents: dto.totalCents,
        items: {
          create: dto.items.map((i) => ({
            productId: i.productId,
            sizeId: i.sizeId,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
        },
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
}
