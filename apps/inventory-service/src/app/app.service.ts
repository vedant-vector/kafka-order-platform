import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    const database = (await this.prisma.isHealthy()) ? 'up' : 'down';

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      service: 'inventory-service',
      database,
    };
  }
}
