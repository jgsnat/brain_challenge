import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOP_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    const { id } = payload;
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
