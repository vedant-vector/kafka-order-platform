import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_NAMES } from '@kafka-order-platform/contracts';
import { KafkaProducerService } from '@kafka-order-platform/kafka';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<OrdersRepository>;
  let kafkaProducer: jest.Mocked<KafkaProducerService>;

  beforeEach(async () => {
    ordersRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepository>;

    kafkaProducer = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<KafkaProducerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: ordersRepository },
        { provide: KafkaProducerService, useValue: kafkaProducer },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('persists order and publishes order.created event', async () => {
      ordersRepository.create.mockResolvedValue({
        id: 'order-123',
        productName: 'Laptop',
        quantity: 2,
        status: 'PENDING',
        createdAt: new Date('2026-03-07T00:00:00.000Z'),
      });

      const result = await service.create({
        productName: 'Laptop',
        quantity: 2,
      });

      expect(ordersRepository.create).toHaveBeenCalledWith({
        productName: 'Laptop',
        quantity: 2,
      });
      expect(kafkaProducer.publish).toHaveBeenCalledWith(
        EVENT_NAMES.ORDER_CREATED,
        {
          event: EVENT_NAMES.ORDER_CREATED,
          data: {
            orderId: 'order-123',
            productName: 'Laptop',
            quantity: 2,
          },
        },
      );
      expect(result.id).toBe('order-123');
    });
  });
});
