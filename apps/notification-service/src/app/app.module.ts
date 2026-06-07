import { Module } from '@nestjs/common';
import { CommonModule } from '@kafka-order-platform/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [CommonModule.forRoot(), NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
