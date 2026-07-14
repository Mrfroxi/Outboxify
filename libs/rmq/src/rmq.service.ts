import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async onModuleInit() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  async publish(exchange: string, routingKey: string, content: object) {
    if (!this.channel) {
      throw new Error('RMQ channel not initialized');
    }
    await this.channel.assertExchange(exchange, 'topic', {
      durable: true,
    });
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(content)),
      { persistent: true },
    );
  }

  async subscribe(
    queue: string,
    exchange: string,
    routingKey: string,
    handler: (msg: object) => Promise<void>,
  ) {
    if (!this.channel) {
      throw new Error('RMQ channel not initialized');
    }
    await this.channel.assertExchange(exchange, 'topic', {
      durable: true,
    });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    await this.channel.consume(queue, (msg: amqp.ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString()) as object;
        handler(content)
          .then(() => {
            if (this.channel) this.channel.ack(msg);
          })
          .catch(() => {
            if (this.channel) this.channel.nack(msg, false, false);
          });
      } catch {
        if (this.channel) this.channel.nack(msg, false, false);
      }
    });
  }
}
