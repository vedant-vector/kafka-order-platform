import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  buildKafkaMicroserviceOptions,
  resolveKafkaConfig,
} from '@kafka-order-platform/kafka';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.connectMicroservice(
    buildKafkaMicroserviceOptions(
      resolveKafkaConfig('inventory-service', {
        brokers: process.env.KAFKA_BROKERS,
      }),
    ),
  );

  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(
    `inventory-service listening at http://localhost:${port}/${globalPrefix}`,
    bootstrap.name,
  );
}

bootstrap();
