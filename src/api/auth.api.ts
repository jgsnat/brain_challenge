import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from './dtos/user/create-user.dto';
import { CredentialsDto } from './dtos/user/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/auth/get-user.decorator';
import { User } from '../domain/user/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authorization API')
export class AuthApi {
  constructor(private service: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Retorna mensagem de sucesso do usuário criado.',
    type: Object,
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
  @ApiOperation({ description: 'Cria um usuário para autenticar-se na API' })
  async signUp(
    @Body(ValidationPipe) userDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.service.signUp(userDto);
    return {
      message: 'Successful registration',
    };
  }

  @Post('/signin')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna caso o usuário tenha sido autenticado com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Retorna caso não tenha sido feita a autenticação com sucesso.',
  })
  @ApiOperation({ description: 'Autentica um usuário na API' })
  async signIn(
    @Body(ValidationPipe) credentials: CredentialsDto,
  ): Promise<{ token: string }> {
    const token = await this.service.signIn(credentials);
    return { token };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do usuário autenticado.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Retorna caso não tenha sido feita a autenticação com sucesso.',
  })
  @ApiOperation({
    description: 'Retorna informações um usuário autenticado na API',
  })
  getMe(@GetUser() user: User): User {
    return user;
  }
}
