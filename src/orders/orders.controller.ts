import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const VALID_STATUS = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

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

  // Detalle de un pedido (dueño o admin)
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const order = await this.ordersService.findOne(
      id,
      req.user.id,
      req.user.role === 'ADMIN',
    );
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  // Cambiar estado del pedido (solo admin)
  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('No autorizado');
    }
    if (!VALID_STATUS.includes(status)) {
      throw new BadRequestException('Estado inválido');
    }
    return this.ordersService.updateStatus(id, status);
  }
}
