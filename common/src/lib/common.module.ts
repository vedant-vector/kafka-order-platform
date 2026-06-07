import { DynamicModule, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { createValidationPipe } from './create-validation-pipe';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({})
export class CommonModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonModule,
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
        {
          provide: APP_PIPE,
          useFactory: () => createValidationPipe(),
        },
      ],
    };
  }
}
