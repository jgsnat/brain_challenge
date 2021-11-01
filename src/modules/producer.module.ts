import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerRepository } from '../domain/producer/producer.repository';
import { ProducerService } from '../service/producer/producer.service';
import { PassportModule } from '@nestjs/passport';
import { ProducerApi } from '../api/producer/producer.api';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProducerRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ProducerService],
  controllers: [ProducerApi],
})
export class ProducerModule {}
