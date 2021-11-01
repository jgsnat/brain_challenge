import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ProducerService } from '../../service/producer/producer.service';
import { Role } from '../../common/auth/role.decorator';
import { UserRole } from '../../common/auth/user-role.enum';
import { FindProducersQueryDto } from '../dtos/producer/find-producers-query.dto';
import { Producer } from '../../domain/producer/producer.entity';
import { CreateProducerDto } from '../dtos/producer/create-producer.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UpdateProducerDto } from '../dtos/producer/update-producer.dto';

@Controller('producer')
@UseGuards(AuthGuard(), RolesGuard)
export class ProducerApi {
  constructor(private service: ProducerService) {}

  @Get()
  @Role(UserRole.USER)
  async findAll(@Query() queryDto: FindProducersQueryDto): Promise<{ list: Producer[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @Role(UserRole.USER)
  async findOne(@Param('id') id): Promise<Producer> {
    return this.service.findById(id);
  }

  @Post()
  @Role(UserRole.USER)
  async create(@Body(ValidationPipe) producerDto: CreateProducerDto): Promise<Producer> {
    return this.service.create(producerDto);
  }

  @Put(':id')
  @Role(UserRole.USER)
  async fullUpdate(@Body(ValidationPipe) producerDto: UpdateProducerDto, @Param('id') id: number) {
    return this.service.updateFull(id, producerDto);
  }

  @Patch(':id')
  @Role(UserRole.USER)
  async incrementalUpdate(@Body(ValidationPipe) producerDto: UpdateProducerDto, @Param('id') id: number) {
    return this.service.updateIncremental(id, producerDto);
  }

  @Delete(':id')
  @Role(UserRole.USER)
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
