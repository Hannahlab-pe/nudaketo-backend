import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const bodyParser = require('body-parser');
  app.use('/webhooks', bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.json({ limit: '1mb' }));

  const allowedOrigins = [
    'https://www.nuda-keto.com',
    'https://nuda-keto.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Sin origin (curl/healthcheck), dominios permitidos o cualquier localhost en dev
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`nudaketo-api running on port ${port}`);
}
bootstrap();
