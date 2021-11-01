import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOP_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    const { id } = payload;
    const user = await this.repository.findOne(id, {
      select: ['id', 'name', 'email', 'role'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
