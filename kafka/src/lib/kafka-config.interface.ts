export interface KafkaModuleConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
}

export interface KafkaEnvironmentConfig {
  clientId?: string;
  brokers?: string;
  groupId?: string;
}

export const DEFAULT_KAFKA_BROKERS = ['localhost:9092'];

export function resolveKafkaConfig(
  serviceName: string,
  env: KafkaEnvironmentConfig = {},
): KafkaModuleConfig {
  return {
    clientId: env.clientId ?? serviceName,
    brokers: env.brokers?.split(',').map((broker) => broker.trim()) ?? DEFAULT_KAFKA_BROKERS,
    groupId: env.groupId ?? `${serviceName}-consumer`,
  };
}
