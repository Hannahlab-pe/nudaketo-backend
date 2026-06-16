import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Garantiza que exista la cuenta de administrador al arrancar.
 * Credenciales configurables por env (con defaults).
 */
@Injectable()
export class AdminBootstrap implements OnModuleInit {
  private readonly logger = new Logger(AdminBootstrap.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const email = (process.env.ADMIN_EMAIL || 'admin@nudaketo.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'nudaketo@987';
    const name = process.env.ADMIN_NAME || 'Administrador NUDA KETO';

    try {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) {
        // Aseguramos que tenga rol ADMIN
        if (existing.role !== 'ADMIN') {
          await this.prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
          });
          this.logger.log(`Usuario ${email} promovido a ADMIN`);
        }
        return;
      }

      const hashed = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: { name, email, password: hashed, role: 'ADMIN' },
      });
      this.logger.log(`Cuenta admin creada: ${email}`);
    } catch (err) {
      this.logger.error(`No se pudo asegurar la cuenta admin: ${err.message}`);
    }
  }
}
