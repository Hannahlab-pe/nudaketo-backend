import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CulqiService } from './culqi.service';
import { MailService } from '../mail/mail.service';
import { SellersService } from '../sellers/sellers.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { getOfficialPrice, getShippingCents } from './catalog';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private culqi: CulqiService,
    private mail: MailService,
    private sellers: SellersService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El pedido no tiene productos');
    }

    // Recalcula el total con precios OFICIALES del servidor (anti-manipulación)
    let itemsCents = 0;
    const validatedItems = dto.items.map((i) => {
      const price = getOfficialPrice(i.productId, i.sizeId);
      if (price === null) {
        throw new BadRequestException(
          `Producto inválido (id ${i.productId}, ${i.sizeId})`,
        );
      }
      const qty = Math.max(1, Math.floor(i.qty));
      itemsCents += Math.round(price * 100) * qty;
      return {
        productId: i.productId,
        sizeId: i.sizeId,
        name: i.name,
        qty,
        price,
      };
    });

    if (itemsCents <= 0) {
      throw new BadRequestException('Total inválido');
    }

    // Validación de datos de envío
    const isDelivery = dto.fulfillment === 'DELIVERY';
    if (isDelivery && (!dto.address || !dto.district || !dto.phone)) {
      throw new BadRequestException(
        'Faltan datos de envío (dirección, distrito y teléfono)',
      );
    }

    // Costo de envío calculado en el servidor
    const shippingCents = getShippingCents(dto.fulfillment, dto.zone);

    // Código de vendedor: descuento (sobre productos) + comisión (snapshot)
    let sellerId: string | null = null;
    let sellerCode: string | null = null;
    let discountCents = 0;
    let commissionCents = 0;
    if (dto.sellerCode) {
      const seller = await this.sellers.findByCode(dto.sellerCode);
      if (seller && seller.role === 'VENDEDOR') {
        sellerId = seller.id;
        sellerCode = seller.sellerCode;
        discountCents = Math.round((itemsCents * (seller.discountPct || 0)) / 100);
        const netItems = itemsCents - discountCents;
        commissionCents = Math.round((netItems * (seller.commissionPct || 0)) / 100);
      }
    }

    const totalCents = itemsCents - discountCents + shippingCents;

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
        fulfillment: dto.fulfillment,
        shippingCents,
        customerName: isDelivery ? dto.customerName ?? null : null,
        phone: isDelivery ? dto.phone ?? null : null,
        address: isDelivery ? dto.address ?? null : null,
        district: isDelivery ? dto.district ?? null : null,
        city: isDelivery ? dto.city ?? null : null,
        reference: isDelivery ? dto.reference ?? null : null,
        mapsLink: isDelivery ? dto.mapsLink ?? null : null,
        sellerId,
        sellerCode,
        discountCents,
        commissionCents,
        items: { create: validatedItems },
      },
      include: { items: true },
    });

    // Guarda la dirección en el perfil del usuario para autocompletar la próxima compra
    if (isDelivery) {
      await this.prisma.user
        .update({
          where: { id: userId },
          data: {
            phone: dto.phone ?? undefined,
            address: dto.address ?? undefined,
            district: dto.district ?? undefined,
            city: dto.city ?? undefined,
            reference: dto.reference ?? undefined,
            mapsLink: dto.mapsLink ?? undefined,
            zone: dto.zone ?? undefined,
          },
        })
        .catch(() => null);
    }

    // Correos de confirmación (no bloquean la respuesta)
    this.mail.sendOrderConfirmation(order).catch(() => null);
    this.mail.sendAdminNotification(order).catch(() => null);

    return {
      orderId: order.id,
      status: order.status,
      totalCents: order.totalCents,
      shippingCents: order.shippingCents,
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

  // Un pedido: el dueño solo ve el suyo; el admin ve cualquiera
  async findOne(orderId: string, userId: string, isAdmin: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    if (!order) return null;
    if (!isAdmin && order.userId !== userId) return null;
    return order;
  }

  // Cambia el estado del pedido (solo admin)
  updateStatus(orderId: string, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: { items: true },
    });
  }
}
