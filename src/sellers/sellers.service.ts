import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  private publicSeller(u: any) {
    return {
      id: u.id, name: u.name, email: u.email,
      sellerCode: u.sellerCode, discountPct: u.discountPct, commissionPct: u.commissionPct,
      createdAt: u.createdAt,
    };
  }

  // Valida un código de vendedor (para el checkout)
  async validateCode(code: string) {
    if (!code) return { valid: false };
    const seller = await this.prisma.user.findUnique({
      where: { sellerCode: code.trim().toUpperCase() },
    });
    if (!seller || seller.role !== 'VENDEDOR') return { valid: false };
    return {
      valid: true,
      code: seller.sellerCode,
      discountPct: seller.discountPct ?? 0,
      sellerName: seller.name,
    };
  }

  // Devuelve el vendedor por código (uso interno en órdenes)
  findByCode(code: string) {
    return this.prisma.user.findUnique({ where: { sellerCode: code.trim().toUpperCase() } });
  }

  async create(dto: CreateSellerDto) {
    const code = dto.code.trim().toUpperCase();
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('El correo ya está registrado');
    const existingCode = await this.prisma.user.findUnique({ where: { sellerCode: code } });
    if (existingCode) throw new BadRequestException('Ese código ya está en uso');

    const hashed = await bcrypt.hash(dto.password, 10);
    const seller = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role: 'VENDEDOR',
        sellerCode: code,
        discountPct: dto.discountPct,
        commissionPct: dto.commissionPct,
      },
    });
    return this.publicSeller(seller);
  }

  // Lista de vendedores con sus métricas (para el admin)
  async listWithStats() {
    const sellers = await this.prisma.user.findMany({
      where: { role: 'VENDEDOR' },
      orderBy: { createdAt: 'asc' },
    });
    const result: any[] = [];
    for (const s of sellers) {
      const agg = await this.prisma.order.aggregate({
        where: { sellerId: s.id },
        _count: true,
        _sum: { totalCents: true, commissionCents: true, discountCents: true },
      });
      result.push({
        ...this.publicSeller(s),
        ventas: agg._count,
        totalVendidoCents: agg._sum.totalCents || 0,
        comisionCents: agg._sum.commissionCents || 0,
        descuentoCents: agg._sum.discountCents || 0,
      });
    }
    return result;
  }

  // Ventas propias de un vendedor + totales
  async mySales(sellerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { sellerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    const totalVendidoCents = orders.reduce((a, o) => a + o.totalCents, 0);
    const comisionCents = orders.reduce((a, o) => a + (o.commissionCents || 0), 0);
    return { orders, totalVendidoCents, comisionCents, ventas: orders.length };
  }
}
