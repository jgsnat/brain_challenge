import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { ProducerModule } from './modules/producer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    WinstonModule.forRoot(winstonConfig),
    UserModule,
    ProducerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
