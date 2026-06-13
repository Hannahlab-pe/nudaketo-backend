import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      where: { active: true },
      include: { sizes: true },
      orderBy: { id: 'asc' },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { sizes: true },
    });
  }
}
