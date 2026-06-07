import { KafkaOptions, Transport } from '@nestjs/microservices';
import { KafkaModuleConfig } from './kafka-config.interface';

export function buildKafkaClientOptions(
  config: KafkaModuleConfig,
): KafkaOptions['options'] {
  return {
    client: {
      clientId: config.clientId,
      brokers: config.brokers,
    },
    consumer: {
      groupId: config.groupId,
    },
  };
}

export function buildKafkaMicroserviceOptions(
  config: KafkaModuleConfig,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: buildKafkaClientOptions(config),
  };
}
