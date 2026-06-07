import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_NAMES } from '@kafka-order-platform/contracts';
import { KafkaProducerService } from '@kafka-order-platform/kafka';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryRepository: jest.Mocked<InventoryRepository>;
  let kafkaProducer: jest.Mocked<KafkaProducerService>;

  beforeEach(async () => {
    inventoryRepository = {
      findAll: jest.fn(),
      findByProductName: jest.fn(),
      applyOrderCreated: jest.fn(),
    } as unknown as jest.Mocked<InventoryRepository>;

    kafkaProducer = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<KafkaProducerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: InventoryRepository, useValue: inventoryRepository },
        { provide: KafkaProducerService, useValue: kafkaProducer },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  describe('handleOrderCreated', () => {
    it('updates stock and publishes inventory.updated event', async () => {
      inventoryRepository.applyOrderCreated.mockResolvedValue({
        duplicate: false,
        inventory: {
          id: 'inv-1',
          productName: 'Laptop',
          availableStock: 8,
          updatedAt: new Date('2026-03-07T00:00:00.000Z'),
        },
      });

      await service.handleOrderCreated({
        event: EVENT_NAMES.ORDER_CREATED,
        data: {
          orderId: 'order-123',
          productName: 'Laptop',
          quantity: 2,
        },
      });

      expect(inventoryRepository.applyOrderCreated).toHaveBeenCalledWith(
        'order-123',
        'Laptop',
        2,
      );
      expect(kafkaProducer.publish).toHaveBeenCalledWith(
        EVENT_NAMES.INVENTORY_UPDATED,
        {
          event: EVENT_NAMES.INVENTORY_UPDATED,
          data: {
            productName: 'Laptop',
            remainingStock: 8,
          },
        },
      );
    });

    it('skips publish when order was already processed', async () => {
      inventoryRepository.applyOrderCreated.mockResolvedValue({
        duplicate: true,
        inventory: {
          id: 'inv-1',
          productName: 'Laptop',
          availableStock: 8,
          updatedAt: new Date('2026-03-07T00:00:00.000Z'),
        },
      });

      await service.handleOrderCreated({
        event: EVENT_NAMES.ORDER_CREATED,
        data: {
          orderId: 'order-123',
          productName: 'Laptop',
          quantity: 2,
        },
      });

      expect(kafkaProducer.publish).not.toHaveBeenCalled();
    });
  });
});
