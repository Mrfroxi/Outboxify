import { DynamicModule, Module, Provider } from '@nestjs/common';
import { RmqService } from './rmq.service.js';

export const RMQ_URL = 'RMQ_URL';

@Module({})
export class RmqModule {
  static register(url: string): DynamicModule {
    const providers: Provider[] = [
      { provide: RMQ_URL, useValue: url },
      {
        provide: RmqService,
        useFactory: (rmqUrl: string) => new RmqService(rmqUrl),
        inject: [RMQ_URL],
      },
    ];

    return {
      module: RmqModule,
      providers,
      exports: [RmqService],
    };
  }
}
