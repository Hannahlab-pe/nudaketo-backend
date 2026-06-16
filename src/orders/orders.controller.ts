import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  // Panel admin: todos los pedidos. Solo rol ADMIN.
  @Get('all')
  findAllAdmin(@Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('No autorizado');
    }
    return this.ordersService.findAllForAdmin();
  }
}
