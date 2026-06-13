import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // La red privada de Railway tarda unos segundos en estar lista al arrancar.
    // Reintentamos la conexión para no crashear el contenedor en ese arranque.
    const maxRetries = 10;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        this.logger.log('Conectado a la base de datos');
        return;
      } catch (err) {
        this.logger.warn(
          `Intento ${attempt}/${maxRetries} de conexión a la DB falló: ${err.message}`,
        );
        if (attempt === maxRetries) throw err;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
