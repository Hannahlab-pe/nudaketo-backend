import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Imágenes de producto subidas desde el panel.
 *
 * Se guardan en Postgres a propósito: Railway reinicia el contenedor con el
 * disco limpio en cada deploy, así que un archivo escrito en /uploads se
 * perdería. No hay S3 ni Cloudinary configurado y esto evita depender de una
 * cuenta externa. Con ~20 productos el peso en BD es despreciable.
 */
@Controller('media')
export class MediaController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BYTES } }))
  async upload(@Request() req: any, @UploadedFile() file: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('No autorizado');
    if (!file) throw new BadRequestException('No llegó ningún archivo');
    if (!ALLOWED.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usa JPG, PNG, WebP o AVIF.');
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('La imagen supera los 4 MB');
    }

    const asset = await this.prisma.mediaAsset.create({
      data: { mime: file.mimetype, size: file.size, data: file.buffer },
      select: { id: true, mime: true, size: true },
    });

    // El front guarda esta url en Product.image / Product.imageDetail
    return { ...asset, url: `/media/${asset.id}` };
  }

  @Get(':id')
  async serve(@Param('id') id: string, @Res() res: Response) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Imagen no encontrada');

    // El contenido de un id nunca cambia (subir otra imagen crea otro id),
    // así que se puede cachear de forma agresiva.
    res.setHeader('Content-Type', asset.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', String(asset.size));
    res.end(Buffer.from(asset.data));
  }
}
