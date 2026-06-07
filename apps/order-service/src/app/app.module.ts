import { Module } from '@nestjs/common';
import { CommonModule } from '@kafka-order-platform/common';
import {
  KafkaModule,
  resolveKafkaConfig,
} from '@kafka-order-platform/kafka';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from '../orders/orders.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    CommonModule.forRoot(),
    PrismaModule,
    KafkaModule.registerProducer(
      resolveKafkaConfig('order-service', {
        brokers: process.env.KAFKA_BROKERS,
      }),
    ),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
