import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  EVENT_NAMES,
  OrderCreatedEvent,
} from '@kafka-order-platform/contracts';
import { KafkaProducerService } from '@kafka-order-platform/kafka';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async create(dto: CreateOrderDto) {
    const order = await this.ordersRepository.create(dto);

    const event: OrderCreatedEvent = {
      event: EVENT_NAMES.ORDER_CREATED,
      data: {
        orderId: order.id,
        productName: order.productName,
        quantity: order.quantity,
      },
    };

    await this.kafkaProducer.publish(EVENT_NAMES.ORDER_CREATED, event);
    this.logger.log(`Order created and event published: ${order.id}`);

    return order;
  }

  findAll() {
    return this.ordersRepository.findAll();
  }

  async findById(id: string) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }
}
