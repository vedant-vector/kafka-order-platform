import { KAFKA_TOPICS } from './topics';

export const EVENT_NAMES = {
  ORDER_CREATED: KAFKA_TOPICS.ORDER_CREATED,
  INVENTORY_UPDATED: KAFKA_TOPICS.INVENTORY_UPDATED,
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];
