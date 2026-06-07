import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_NAMES,
  InventoryUpdatedEvent,
  OrderCreatedEvent,
} from '@kafka-order-platform/contracts';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsConsumer {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(EVENT_NAMES.ORDER_CREATED)
  handleOrderCreated(@Payload() event: OrderCreatedEvent) {
    this.notificationsService.handleOrderCreated(event);
  }

  @EventPattern(EVENT_NAMES.INVENTORY_UPDATED)
  handleInventoryUpdated(@Payload() event: InventoryUpdatedEvent) {
    this.notificationsService.handleInventoryUpdated(event);
  }
}
