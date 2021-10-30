import { createParamDecorator } from '@nestjs/common';
import { User } from '../../domain/user/user.entity';

export const GetUser = createParamDecorator(
  (data, req): User => req.args[0].user,
);
