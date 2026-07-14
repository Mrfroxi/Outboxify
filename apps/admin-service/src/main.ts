import { NestFactory } from '@nestjs/core';
import { AdminServiceModule } from './admin-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AdminServiceModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
