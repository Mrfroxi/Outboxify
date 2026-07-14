import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminServiceModule } from './admin-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AdminServiceModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port);
}
void bootstrap();
