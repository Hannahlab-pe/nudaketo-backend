import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CulqiService } from './culqi.service';
import { SellersModule } from '../sellers/sellers.module';
import { ProductsModule } from '../products/products.module';
import { OdooModule } from '../odoo/odoo.module';

@Module({
  imports: [SellersModule, ProductsModule, OdooModule],
  providers: [OrdersService, CulqiService],
  controllers: [OrdersController],
})
export class OrdersModule {}
