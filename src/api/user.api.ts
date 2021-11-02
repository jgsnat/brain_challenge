import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/auth/roles.guard';
import { UserService } from '../service/user.service';
import { Role } from '../common/auth/role.decorator';
import { UserRole } from '../common/auth/user-role.enum';
import { CreateUserDto } from './dtos/user/create-user.dto';
import { User } from '../domain/user/user.entity';
import { GetUser } from '../common/auth/get-user.decorator';
import { FindUsersQueryDto } from './dtos/user/find-users-query.dto';
import { UpdateUserDto } from './dtos/user/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
@ApiTags('User API')
export class UserApi {
  constructor(private service: UserService) {}

  @Get()
  @Role(UserRole.ADMIN)
  @HttpCode(206)
  @ApiResponse({
    status: 206,
    description: 'Retorna a lista de usuários paginada.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({ description: 'Listagem de todos os usuários paginada' })
  async findAll(
    @Query() queryDto: FindUsersQueryDto,
  ): Promise<{ list: User[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({ description: 'Retornar um o usuário.' })
  async findOne(@Param('id') id): Promise<User> {
    return this.service.findById(id);
  }

  @Post()
  @Role(UserRole.ADMIN)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Retorna o usuário criado com sucesso.',
    type: User,
  })
  @ApiResponse({
    status: 422,
    description:
      'Retorna caso não sejam iguais as senha e senha de confirmação passadas',
  })
  @ApiResponse({
    status: 409,
    description: 'Retorna caso seja passado um e-mail já cadastrado na base',
  })
  @ApiOperation({ description: 'Criação de usuários' })
  async create(@Body(ValidationPipe) userDto: CreateUserDto): Promise<User> {
    return this.service.createAdminUser(userDto);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o usuário atualizado com sucesso.',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description:
      'Retorna caso o usuário autenticado não tenha permissões de acesso',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiResponse({
    status: 422,
    description:
      'Retorna caso não sejam iguais as senha e senha de confirmação passadas',
  })
  @ApiOperation({ description: 'Atualização de todos os dados de um usuário' })
  async fullUpdate(
    @Body(ValidationPipe) userDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    this.validationAuthorization(user, id);
    return this.service.updateFull(id, userDto);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o usuário atualizado com sucesso.',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description:
      'Retorna caso o usuário autenticado não tenha permissões de acesso',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiResponse({
    status: 422,
    description:
      'Retorna caso não sejam iguais as senha e senha de confirmação passadas',
  })
  @ApiOperation({
    description: 'Atualização de informações passadas para um usuário',
  })
  async incrementalUpdate(
    @Body(ValidationPipe) userDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    this.validationAuthorization(user, id);
    return this.service.updateIncremental(id, userDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Role(UserRole.ADMIN)
  @ApiResponse({
    status: 204,
    description: 'Retorna caso o usuário tenha sido deletado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Retorna caso não seja encontrado nenhum recurso com os parâmetros passados',
  })
  @ApiOperation({
    description: 'Exclusão (lógica) de um usuário',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }

  private validationAuthorization(user: User, id: string) {
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(
        'You are not authorized to access this feature',
      );
    }
  }
}
