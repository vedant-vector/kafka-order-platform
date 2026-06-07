import { Injectable, Logger } from '@nestjs/common';
import {
  InventoryUpdatedEvent,
  OrderCreatedEvent,
} from '@kafka-order-platform/contracts';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  handleOrderCreated(event: OrderCreatedEvent): void {
    const { orderId, productName, quantity } = event.data;

    this.logger.log(
      `Order notification: ${quantity}x ${productName} placed (orderId=${orderId})`,
    );
    this.logger.log(`Event metadata: ${JSON.stringify(event)}`);
  }

  handleInventoryUpdated(event: InventoryUpdatedEvent): void {
    const { productName, remainingStock } = event.data;

    this.logger.log(
      `Inventory notification: ${productName} now has ${remainingStock} in stock`,
    );
    this.logger.log(`Event metadata: ${JSON.stringify(event)}`);
  }
}
