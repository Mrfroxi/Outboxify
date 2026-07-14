import { Module } from '@nestjs/common';
import { AdminServiceController } from './admin-service.controller.js';
import { AdminServiceService } from './admin-service.service.js';

@Module({
  imports: [],
  controllers: [AdminServiceController],
  providers: [AdminServiceService],
})
export class AdminServiceModule {}
