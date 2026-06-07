import { Module } from '@nestjs/common';
import { CommonModule } from '@kafka-order-platform/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommonModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
