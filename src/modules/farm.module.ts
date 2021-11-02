import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmRepository } from '../domain/farm/farm.repository';
import { FarmService } from '../service/farm.service';

@Module({
  imports: [TypeOrmModule.forFeature([FarmRepository])],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
