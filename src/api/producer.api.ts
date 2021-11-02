import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProducerService } from '../service/producer.service';
import { Role } from '../common/auth/role.decorator';
import { UserRole } from '../common/auth/user-role.enum';
import { FindProducersQueryDto } from './dtos/producer/find-producers-query.dto';
import { Producer } from '../domain/producer/producer.entity';
import { CreateProducerDto } from './dtos/producer/create-producer.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/auth/roles.guard';
import { UpdateProducerDto } from './dtos/producer/update-producer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('producer')
@UseGuards(AuthGuard(), RolesGuard)
@ApiTags('Producer API')
export class ProducerApi {
  constructor(private service: ProducerService) {}

  @Get()
  @Role(UserRole.USER)
  @HttpCode(206)
  @ApiResponse({
    status: 206,
    description: 'Retorna a lista de produtores paginada.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({ description: 'Listagem de todos os produtores paginada' })
  async findAll(
    @Query() queryDto: FindProducersQueryDto,
  ): Promise<{ list: Producer[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @Role(UserRole.USER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna um produtor.',
    type: Producer,
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({ description: 'Retornar um o produtor.' })
  async findOne(@Param('id') id): Promise<Producer> {
    return this.service.findById(id);
  }

  @Post()
  @Role(UserRole.USER)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Retorna o produtor criado com sucesso.',
    type: Producer,
  })
  @ApiResponse({
    status: 409,
    description: 'Retorna caso seja passado um e-mail já cadastrado na base',
  })
  @ApiOperation({ description: 'Criação de produtores' })
  async create(
    @Body(ValidationPipe) producerDto: CreateProducerDto,
  ): Promise<Producer> {
    return this.service.create(producerDto);
  }

  @Put(':id')
  @Role(UserRole.USER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o produtor atualizado com sucesso.',
    type: Producer,
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({ description: 'Atualização de todos os dados de um produtor' })
  async fullUpdate(
    @Body(ValidationPipe) producerDto: UpdateProducerDto,
    @Param('id') id: number,
  ) {
    return this.service.updateFull(id, producerDto);
  }

  @Patch(':id')
  @Role(UserRole.USER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o produtor atualizado com sucesso.',
    type: Producer,
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({
    description: 'Atualização de informações passadas para um produtor',
  })
  async incrementalUpdate(
    @Body(ValidationPipe) producerDto: UpdateProducerDto,
    @Param('id') id: number,
  ) {
    return this.service.updateIncremental(id, producerDto);
  }

  @Delete(':id')
  @Role(UserRole.USER)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Retorna caso o produtor tenha sido deletado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({
    description: 'Exclusão (lógica) de um produtor',
  })
  async delete(@Param('id') id: number): Promise<void> {
    await this.service.delete(id);
  }
}
