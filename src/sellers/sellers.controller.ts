import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sellers')
export class SellersController {
  constructor(private sellers: SellersService) {}

  // Validar código (checkout) — requiere estar logueado
  @UseGuards(JwtAuthGuard)
  @Get('validate/:code')
  validate(@Param('code') code: string) {
    return this.sellers.validateCode(code);
  }

  // Mis ventas (vendedor)
  @UseGuards(JwtAuthGuard)
  @Get('my-sales')
  mySales(@Request() req: any) {
    if (req.user.role !== 'VENDEDOR') throw new ForbiddenException('Solo vendedores');
    return this.sellers.mySales(req.user.id);
  }

  // Listar vendedores con métricas (admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Request() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('No autorizado');
    return this.sellers.listWithStats();
  }

  // Crear vendedor (admin)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateSellerDto) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('No autorizado');
    return this.sellers.create(dto);
  }
}
