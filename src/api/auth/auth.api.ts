import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CredentialsDto } from '../dtos/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../common/auth/get-user.decorator';
import { User } from '../../domain/user/user.entity';

@Controller('auth')
export class AuthApi {
  constructor(private service: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) userDto: CreateUserDto): Promise<{ message: string }> {
    await this.service.signUp(userDto);
    return {
      message: 'Successful registration',
    };
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) credentials: CredentialsDto): Promise<{ token: string }> {
    await this.service.signIn(credentials);
    return {
      token: 'Successful registration',
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
