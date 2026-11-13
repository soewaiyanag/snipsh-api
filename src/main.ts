import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle('snipsh API')
    .addServer('https://snipsh-api.onrender.com', 'Production')
    .addServer('http://localhost:3000', 'Local')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Protected routes need the token; public ones (login, register, redirect) ignore it
  document.security = [{ bearer: [] }];
  SwaggerModule.setup('docs', app, document);
  // Comma-separated list of UI origins allowed to call the API from a browser
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? false });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
