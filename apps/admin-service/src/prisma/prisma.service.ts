import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.ADMIN_DATABASE_URL,
    });
    this.client = new PrismaClient({ adapter });
  }

  get venue() {
    return this.client.venue;
  }

  get event() {
    return this.client.event;
  }

  get seat() {
    return this.client.seat;
  }

  get outbox() {
    return this.client.outbox;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }

  get $queryRaw() {
    return this.client.$queryRaw.bind(this.client);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
