import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SEED_PRODUCTS } from './seed-data';

/**
 * Puebla la tabla Product la PRIMERA vez que arranca contra una BD vacía.
 *
 * Si ya hay productos no toca nada: a partir de ese momento la fuente de
 * verdad es la BD y manda lo que el admin edite desde el panel. Así un
 * deploy nunca pisa un precio que el cliente acaba de cambiar.
 */
@Injectable()
export class ProductsBootstrap implements OnModuleInit {
  private readonly logger = new Logger(ProductsBootstrap.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const existing = await this.prisma.product.findMany({
        select: { id: true, slug: true },
      });
      const haveIds = new Set(existing.map((p) => p.id));
      const haveSlugs = new Set(existing.map((p) => p.slug));

      // Solo crea los que faltan. Un producto que ya está en la BD no se toca
      // nunca: puede tener un precio que el admin cambió desde el panel y un
      // deploy jamás debe pisarlo.
      const missing = SEED_PRODUCTS.filter(
        (p) => !haveIds.has(p.id) && !haveSlugs.has(p.slug),
      );

      for (const p of missing) {
        const { sizes, ...data } = p;
        await this.prisma.product.create({
          data: { ...data, sizes: { create: sizes } },
        });
      }

      if (missing.length) {
        // Deja la secuencia de ids por encima del máximo, porque sembramos con
        // id explícito y el autoincrement se quedaría atrás.
        const max = Math.max(...SEED_PRODUCTS.map((p) => p.id));
        await this.prisma.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), ${max})`,
        );
      }

      this.logger.log(
        `Catálogo: ${existing.length} ya existían, ${missing.length} creados` +
          (missing.length ? ` (${missing.map((p) => p.slug).join(', ')})` : ''),
      );
    } catch (err) {
      this.logger.error(`No se pudo sembrar el catálogo: ${err.message}`);
    }
  }
}
