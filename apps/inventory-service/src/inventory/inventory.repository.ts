import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.inventory.findMany({
      orderBy: { productName: 'asc' },
    });
  }

  findByProductName(productName: string) {
    return this.prisma.inventory.findUnique({
      where: { productName },
    });
  }

  applyOrderCreated(orderId: string, productName: string, quantity: number) {
    return this.prisma.$transaction(async (tx) => {
      const processed = await tx.processedOrder.findUnique({
        where: { orderId },
      });

      if (processed) {
        const inventory = await tx.inventory.findUnique({
          where: { productName },
        });

        return { duplicate: true as const, inventory };
      }

      await tx.processedOrder.create({ data: { orderId } });

      const inventory = await tx.inventory.upsert({
        where: { productName },
        create: {
          productName,
          availableStock: -quantity,
        },
        update: {
          availableStock: { decrement: quantity },
        },
      });

      return { duplicate: false as const, inventory };
    });
  }
}
