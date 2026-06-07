import { EVENT_NAMES } from './event-names';

export interface InventoryUpdatedData {
  productName: string;
  remainingStock: number;
}

export interface InventoryUpdatedEvent {
  event: typeof EVENT_NAMES.INVENTORY_UPDATED;
  data: InventoryUpdatedData;
}
