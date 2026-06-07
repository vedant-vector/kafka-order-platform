import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_NAMES,
  OrderCreatedEvent,
} from '@kafka-order-platform/contracts';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryConsumer {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern(EVENT_NAMES.ORDER_CREATED)
  handleOrderCreated(@Payload() event: OrderCreatedEvent) {
    return this.inventoryService.handleOrderCreated(event);
  }
}
