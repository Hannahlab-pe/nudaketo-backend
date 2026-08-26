import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsBootstrap } from './products.bootstrap';
import { OdooModule } from '../odoo/odoo.module';

@Module({
  imports: [OdooModule],
  providers: [ProductsService, ProductsBootstrap],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
