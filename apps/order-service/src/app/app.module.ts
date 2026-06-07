import { Module } from '@nestjs/common';
import { CommonModule } from '@kafka-order-platform/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CommonModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
