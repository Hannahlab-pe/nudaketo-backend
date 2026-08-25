import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Pedidos que cuentan como venta real (un cancelado no factura). */
const SOLD = { status: { not: 'CANCELLED' as const } };

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Todo lo que pinta el dashboard, en una sola llamada.
   * `days` es la ventana para las series de tiempo (por defecto 30).
   */
  async stats(days = 30) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    // Ventana anterior del mismo tamaño, para comparar
    const prevSince = new Date(since);
    prevSince.setDate(prevSince.getDate() - days);

    const [orders, prevOrders, totalClients, products] = await Promise.all([
      this.prisma.order.findMany({
        where: { ...SOLD, createdAt: { gte: since } },
        include: { items: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.order.findMany({
        where: { ...SOLD, createdAt: { gte: prevSince, lt: since } },
        select: { totalCents: true },
      }),
      this.prisma.user.count({ where: { role: 'CLIENTE' } }),
      this.prisma.product.count({ where: { active: true } }),
    ]);

    // Totales históricos (no solo la ventana)
    const [allTime, statusGroups] = await Promise.all([
      this.prisma.order.aggregate({
        where: SOLD,
        _sum: { totalCents: true },
        _count: true,
      }),
      this.prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const revenue = orders.reduce((a, o) => a + o.totalCents, 0);
    const prevRevenue = prevOrders.reduce((a, o) => a + o.totalCents, 0);
    const count = orders.length;
    const prevCount = prevOrders.length;

    // ── Serie diaria: rellena los días sin ventas con 0 para que el gráfico
    // no mienta uniendo dos puntos lejanos con una recta.
    const byDay = new Map<string, { revenueCents: number; orders: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      byDay.set(dayKey(d), { revenueCents: 0, orders: 0 });
    }
    for (const o of orders) {
      const k = dayKey(o.createdAt);
      const slot = byDay.get(k);
      if (slot) {
        slot.revenueCents += o.totalCents;
        slot.orders += 1;
      }
    }
    const series = Array.from(byDay, ([date, v]) => ({ date, ...v }));

    // ── Top productos por unidades e ingreso (dentro de la ventana)
    const prodMap = new Map<string, { name: string; qty: number; revenueCents: number }>();
    for (const o of orders) {
      for (const it of o.items) {
        const cur = prodMap.get(it.name) ?? { name: it.name, qty: 0, revenueCents: 0 };
        cur.qty += it.qty;
        cur.revenueCents += Math.round(it.price * 100) * it.qty;
        prodMap.set(it.name, cur);
      }
    }
    const topProducts = Array.from(prodMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    // ── Reparto entre envío y recojo
    const delivery = orders.filter((o) => o.fulfillment === 'DELIVERY').length;

    const statusCounts: Record<string, number> = {};
    for (const g of statusGroups) statusCounts[g.status] = g._count._all;

    return {
      window: { days, since: since.toISOString() },
      kpis: {
        revenueCents: revenue,
        revenueDeltaPct: pctChange(revenue, prevRevenue),
        orders: count,
        ordersDeltaPct: pctChange(count, prevCount),
        avgTicketCents: count ? Math.round(revenue / count) : 0,
        clients: totalClients,
        activeProducts: products,
        allTimeRevenueCents: allTime._sum.totalCents ?? 0,
        allTimeOrders: allTime._count,
      },
      series,
      topProducts,
      fulfillment: { delivery, pickup: count - delivery },
      statusCounts,
    };
  }

  /** Clientes con sus métricas de compra, ordenados por lo que más gastaron. */
  async customers() {
    const users = await this.prisma.user.findMany({
      where: { role: 'CLIENTE' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        district: true,
        city: true,
        createdAt: true,
        orders: {
          where: SOLD,
          select: { totalCents: true, createdAt: true },
        },
      },
    });

    return users
      .map((u) => {
        const spentCents = u.orders.reduce((a, o) => a + o.totalCents, 0);
        const last = u.orders.reduce<Date | null>(
          (acc, o) => (!acc || o.createdAt > acc ? o.createdAt : acc),
          null,
        );
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          district: u.district,
          city: u.city,
          createdAt: u.createdAt,
          orders: u.orders.length,
          spentCents,
          avgTicketCents: u.orders.length ? Math.round(spentCents / u.orders.length) : 0,
          lastOrderAt: last,
        };
      })
      .sort((a, b) => b.spentCents - a.spentCents);
  }
}

function pctChange(now: number, before: number): number | null {
  if (!before) return null; // sin base de comparación, no inventamos un %
  return Math.round(((now - before) / before) * 1000) / 10;
}
