import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../service/user/user.service';
import { UserRepository } from '../domain/user/user.repository';
import { UserApi } from '../api/user/user.api';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService],
  controllers: [UserApi],
})
export class UserModule {}
