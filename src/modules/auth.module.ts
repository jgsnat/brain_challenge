import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { JwtStrategy } from '../common/auth/jwt.strategy';
import { AuthApi } from '../api/auth.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user/user.repository';
import { UserService } from '../service/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.TOP_SECRET,
      signOptions: {
        expiresIn: 18000,
      },
    }),
  ],
  controllers: [AuthApi],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
