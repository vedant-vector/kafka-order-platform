import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModuleConfig } from './kafka-config.interface';
import { buildKafkaClientOptions } from './kafka-options.factory';
import { KAFKA_CLIENT } from './kafka.constants';
import { KafkaProducerService } from './kafka-producer.service';

@Module({})
export class KafkaModule {
  static registerProducer(config: KafkaModuleConfig): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_CLIENT,
            transport: Transport.KAFKA,
            options: buildKafkaClientOptions(config),
          },
        ]),
      ],
      providers: [KafkaProducerService],
      exports: [KafkaProducerService, ClientsModule],
    };
  }
}
