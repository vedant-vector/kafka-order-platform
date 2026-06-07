import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  EVENT_NAMES,
  InventoryUpdatedEvent,
  OrderCreatedEvent,
} from '@kafka-order-platform/contracts';
import { KafkaProducerService } from '@kafka-order-platform/kafka';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  findAll() {
    return this.inventoryRepository.findAll();
  }

  async findByProductName(productName: string) {
    const inventory = await this.inventoryRepository.findByProductName(
      productName,
    );

    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ${productName} not found`,
      );
    }

    return inventory;
  }

  async handleOrderCreated(event: OrderCreatedEvent) {
    const { orderId, productName, quantity } = event.data;

    const result = await this.inventoryRepository.applyOrderCreated(
      orderId,
      productName,
      quantity,
    );

    if (result.duplicate) {
      this.logger.log(
        `Skipping duplicate order.created for orderId=${orderId}`,
      );
      return;
    }

    const inventoryEvent: InventoryUpdatedEvent = {
      event: EVENT_NAMES.INVENTORY_UPDATED,
      data: {
        productName: result.inventory.productName,
        remainingStock: result.inventory.availableStock,
      },
    };

    await this.kafkaProducer.publish(
      EVENT_NAMES.INVENTORY_UPDATED,
      inventoryEvent,
    );
    this.logger.log(
      `Stock updated for ${productName}, remaining: ${result.inventory.availableStock}`,
    );
  }
}
