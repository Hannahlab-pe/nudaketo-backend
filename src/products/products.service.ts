import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OdooService } from '../odoo/odoo.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

/** Forma que espera el frontend (misma que tenía el archivo estático). */
function toPublic(p: any) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    image: p.image,
    imageDetail: p.imageDetail,
    shortDesc: p.shortDesc,
    description: p.description,
    highlights: p.highlights,
    ingredients: p.ingredients ?? [],
    nutrition: p.nutriKcal
      ? {
          serving: p.nutriServing,
          kcal: p.nutriKcal,
          fat: p.nutriFat,
          carbs: p.nutriCarbs,
          protein: p.nutriProtein,
        }
      : null,
    badge: p.badge,
    accentClass: p.accentClass,
    btnClass: p.btnClass,
    cardBg: p.cardBg,
    protein: p.protein,
    netWeight: p.netWeight,
    packaging: p.packaging,
    refrigerated: p.refrigerated,
    stock: p.stock,
    active: p.active,
    sizes: (p.sizes ?? [])
      .slice()
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((s: any) => ({
        id: s.sizeKey,
        label: s.label,
        size: s.size,
        pieces: s.pieces,
        price: s.price,
      })),
  };
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService, private odoo: OdooService) {}

  // ── Público ────────────────────────────────────────────────────────────
  async findAll() {
    const rows = await this.prisma.product.findMany({
      where: { active: true },
      include: { sizes: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return rows.map(toPublic);
  }

  async findBySlug(slug: string) {
    const p = await this.prisma.product.findUnique({
      where: { slug },
      include: { sizes: true },
    });
    if (!p || !p.active) return null;
    return toPublic(p);
  }

  // ── Admin ──────────────────────────────────────────────────────────────
  /** Incluye los inactivos: el panel tiene que poder verlos para reactivarlos. */
  async findAllAdmin() {
    const rows = await this.prisma.product.findMany({
      include: { sizes: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return rows.map(toPublic);
  }

  async create(dto: CreateProductDto) {
    if (!dto.sizes?.length) {
      throw new BadRequestException('El producto necesita al menos una presentación');
    }
    this.assertUniqueSizeKeys(dto.sizes);

    const exists = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('Ya existe un producto con ese slug');

    const { sizes, ...data } = dto;
    const created = await this.prisma.product.create({
      data: {
        ...data,
        ingredients: dto.ingredients ?? [],
        sizes: { create: sizes.map((s, i) => ({ ...s, sortOrder: s.sortOrder ?? i })) },
      },
      include: { sizes: true },
    });

    this.odoo.sincronizarProducto({
      productId: created.id,
      name: created.name,
      shortDesc: created.shortDesc,
      description: created.description,
      imageId: created.image?.split('/media/')[1] ?? null,
      sizes: created.sizes.map((s) => ({ sizeKey: s.sizeKey, label: s.label, price: s.price })),
    }).catch((err) => this.logger.error(`Odoo sync producto ${created.id}: ${err.message}`));

    return toPublic(created);
  }

  async update(id: number, dto: UpdateProductDto) {
    const current = await this.prisma.product.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Producto no encontrado');

    if (dto.slug && dto.slug !== current.slug) {
      const clash = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
      if (clash) throw new ConflictException('Ya existe un producto con ese slug');
    }

    const { sizes, ...data } = dto;

    // Las presentaciones se reemplazan en bloque dentro de una transacción,
    // para que el producto nunca quede un instante sin precios.
    if (sizes) {
      if (!sizes.length) {
        throw new BadRequestException('El producto necesita al menos una presentación');
      }
      this.assertUniqueSizeKeys(sizes);
      await this.prisma.$transaction([
        this.prisma.productSize.deleteMany({ where: { productId: id } }),
        this.prisma.productSize.createMany({
          data: sizes.map((s, i) => ({
            productId: id,
            sizeKey: s.sizeKey,
            label: s.label,
            size: s.size,
            pieces: s.pieces,
            price: s.price,
            sortOrder: s.sortOrder ?? i,
          })),
        }),
      ]);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: { sizes: true },
    });

    this.odoo.actualizarProductoOdoo({
      productId: updated.id,
      name: updated.name,
      shortDesc: updated.shortDesc,
      description: updated.description,
      imageId: updated.image?.split('/media/')[1] ?? null,
      stock: updated.stock ?? null,
      sizes: updated.sizes.map((s) => ({ sizeKey: s.sizeKey, label: s.label, price: s.price })),
    }).catch((err) => this.logger.error(`Odoo update producto ${updated.id}: ${err.message}`));

    return toPublic(updated);
  }

  /**
   * No borra de verdad: lo desactiva. Los pedidos ya hechos apuntan a este
   * producto y borrarlo dejaría el historial roto.
   */
  async deactivate(id: number) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');
    const updated = await this.prisma.product.update({
      where: { id },
      data: { active: false },
      include: { sizes: true },
    });
    return toPublic(updated);
  }

  private assertUniqueSizeKeys(sizes: { sizeKey: string }[]) {
    const keys = sizes.map((s) => s.sizeKey);
    if (new Set(keys).size !== keys.length) {
      throw new BadRequestException('Hay presentaciones con el mismo identificador');
    }
  }

  // ── Precios oficiales (usado por órdenes) ──────────────────────────────
  /**
   * Precio real de un item según la BD. Devuelve null si el producto no
   * existe, está inactivo o esa presentación no existe.
   */
  async getOfficialPrice(productId: number, sizeKey: string): Promise<number | null> {
    const size = await this.prisma.productSize.findUnique({
      where: { productId_sizeKey: { productId, sizeKey } },
      include: { product: { select: { active: true } } },
    });
    if (!size || !size.product.active) return null;
    return size.price;
  }

  /** ids de los productos que necesitan cadena de frío. */
  async refrigeratedIds(ids: number[]): Promise<Set<number>> {
    if (!ids.length) return new Set();
    const rows = await this.prisma.product.findMany({
      where: { id: { in: ids }, refrigerated: true },
      select: { id: true },
    });
    return new Set(rows.map((r) => r.id));
  }
}
