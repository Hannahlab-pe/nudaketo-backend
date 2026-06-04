import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CulqiService } from './culqi.service';

@Module({
  providers: [OrdersService, CulqiService],
  controllers: [OrdersController],
})
export class OrdersModule {}
