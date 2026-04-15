import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Use Winston for all NestJS internal logs
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // CORS — supports comma-separated list of origins in FRONTEND_URL
  // Always allows requests with no origin (mobile apps, curl, same-origin)
  // Always allows localhost on any port in development
  const rawOrigins = process.env.FRONTEND_URL ?? '';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);
  const isProduction = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Always allow localhost origins (any port) unless explicitly in production with no localhost allowed
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) return callback(null, true);
      callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`🚀 Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
