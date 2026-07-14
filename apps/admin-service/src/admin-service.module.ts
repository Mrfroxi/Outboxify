import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminServiceController } from './admin-service.controller.js';
import { AdminServiceService } from './admin-service.service.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [AdminServiceController],
  providers: [AdminServiceService],
})
export class AdminServiceModule {}
