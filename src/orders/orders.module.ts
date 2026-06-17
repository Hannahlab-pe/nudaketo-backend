import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CulqiService } from './culqi.service';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [SellersModule],
  providers: [OrdersService, CulqiService],
  controllers: [OrdersController],
})
export class OrdersModule {}
