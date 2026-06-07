import { Module } from '@nestjs/common';
import { InventoryConsumer } from './inventory.consumer';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Module({
  controllers: [InventoryController, InventoryConsumer],
  providers: [InventoryService, InventoryRepository],
})
export class InventoryModule {}
