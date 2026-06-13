import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
}
