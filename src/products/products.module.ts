import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsBootstrap } from './products.bootstrap';

@Module({
  providers: [ProductsService, ProductsBootstrap],
  controllers: [ProductsController],
  // OrdersModule lo usa para validar precios contra la BD
  exports: [ProductsService],
})
export class ProductsModule {}
