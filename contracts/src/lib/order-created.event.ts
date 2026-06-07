import { EVENT_NAMES } from './event-names';

export interface OrderCreatedData {
  orderId: string;
  productName: string;
  quantity: number;
}

export interface OrderCreatedEvent {
  event: typeof EVENT_NAMES.ORDER_CREATED;
  data: OrderCreatedData;
}
