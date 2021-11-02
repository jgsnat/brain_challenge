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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authorization API')
export class AuthApi {
  constructor(private service: AuthService) {}

  @ApiOkResponse({
    description: 'Apply successfully',
  })
  @Post('/signup')
  @HttpCode(201)
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
  async signIn(
    @Body(ValidationPipe) credentials: CredentialsDto,
  ): Promise<{ token: string }> {
    const token = await this.service.signIn(credentials);
    return { token };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @HttpCode(200)
  getMe(@GetUser() user: User): User {
    return user;
  }
}
