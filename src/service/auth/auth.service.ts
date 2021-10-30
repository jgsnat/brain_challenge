import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { User } from '../../domain/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(params): Promise<User> {
    return this.userService.createUser(params);
  }

  async signIn(params): Promise<string> {
    const user = await this.userService.checkCredentials(params);
    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload = { id: user.id };
    return this.jwtService.sign(jwtPayload);
  }
}
