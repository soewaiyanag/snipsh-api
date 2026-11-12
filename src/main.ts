import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Comma-separated list of UI origins allowed to call the API from a browser
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? false });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
