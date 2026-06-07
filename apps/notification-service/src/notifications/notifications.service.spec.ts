import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_NAMES } from '@kafka-order-platform/contracts';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('handleOrderCreated', () => {
    it('logs friendly message and event metadata', () => {
      const event = {
        event: EVENT_NAMES.ORDER_CREATED,
        data: {
          orderId: 'order-123',
          productName: 'Laptop',
          quantity: 2,
        },
      };

      service.handleOrderCreated(event);

      expect(logSpy).toHaveBeenCalledWith(
        'Order notification: 2x Laptop placed (orderId=order-123)',
      );
      expect(logSpy).toHaveBeenCalledWith(
        `Event metadata: ${JSON.stringify(event)}`,
      );
    });
  });

  describe('handleInventoryUpdated', () => {
    it('logs friendly message and event metadata', () => {
      const event = {
        event: EVENT_NAMES.INVENTORY_UPDATED,
        data: {
          productName: 'Laptop',
          remainingStock: 8,
        },
      };

      service.handleInventoryUpdated(event);

      expect(logSpy).toHaveBeenCalledWith(
        'Inventory notification: Laptop now has 8 in stock',
      );
      expect(logSpy).toHaveBeenCalledWith(
        `Event metadata: ${JSON.stringify(event)}`,
      );
    });
  });
});
