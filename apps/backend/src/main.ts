// IMPORTANT: This must be the first import to ensure polyfills are applied
import './polyfills';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Security
  app.use(helmet());

  // CORS - Accept Vercel preview domains and configured origins
  const corsOrigin = configService.get<unknown>('app.corsOrigin');
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches Vercel preview domains pattern
      const vercelPattern =
        /^https:\/\/realestate-vietnam-[a-z0-9]+-ducnguyentans-projects\.vercel\.app$/;
      if (vercelPattern.test(origin)) {
        return callback(null, true);
      }

      // Check configured origins
      if (Array.isArray(corsOrigin)) {
        if (corsOrigin.includes(origin)) {
          return callback(null, true);
        }
      } else if (typeof corsOrigin === 'string') {
        if (corsOrigin === origin) {
          return callback(null, true);
        }
      }

      // Reject
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Vietnam Real Estate API')
    .setDescription(
      'API documentation for Vietnam Real Estate Exchange Platform',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}
void bootstrap();
