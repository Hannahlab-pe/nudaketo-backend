import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

function assertAdmin(req: any) {
  if (req.user?.role !== 'ADMIN') throw new ForbiddenException('No autorizado');
}

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // ── Público ────────────────────────────────────────────────────────────
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ── Admin ──────────────────────────────────────────────────────────────
  // Va antes de :slug para que "admin" no se interprete como un slug.
  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  findAllAdmin(@Request() req: any) {
    assertAdmin(req);
    return this.productsService.findAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreateProductDto) {
    assertAdmin(req);
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    assertAdmin(req);
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deactivate(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    assertAdmin(req);
    return this.productsService.deactivate(id);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard)
  permanentDelete(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    assertAdmin(req);
    return this.productsService.permanentDelete(id);
  }

  // ── Público (al final: captura cualquier cadena) ───────────────────────
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
}
