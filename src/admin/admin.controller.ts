import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  private assertAdmin(req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('No autorizado');
  }

  @Get('stats')
  stats(@Request() req: any, @Query('days') days?: string) {
    this.assertAdmin(req);
    const n = Number(days);
    const window = [7, 30, 90, 365].includes(n) ? n : 30;
    return this.adminService.stats(window);
  }

  @Get('customers')
  customers(@Request() req: any) {
    this.assertAdmin(req);
    return this.adminService.customers();
  }
}
