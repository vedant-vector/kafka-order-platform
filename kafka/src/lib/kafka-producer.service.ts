import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventName } from '@kafka-order-platform/contracts';
import { KAFKA_CLIENT } from './kafka.constants';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer connected');
  }

  async publish<TData>(event: EventName, data: TData): Promise<void> {
    this.kafkaClient.emit(event, data);
    this.logger.log(`Published event ${event}`);
  }
}
