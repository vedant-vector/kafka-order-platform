export const KAFKA_TOPICS = {
  ORDER_CREATED: 'order.created',
  INVENTORY_UPDATED: 'inventory.updated',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
