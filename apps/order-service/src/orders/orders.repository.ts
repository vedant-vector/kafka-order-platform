import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { productName: string; quantity: number }) {
    return this.prisma.order.create({
      data: {
        productName: data.productName,
        quantity: data.quantity,
        status: 'PENDING',
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }
}
