import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../common/auth/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Please provide a valid username' })
  name: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  password: string;

  @IsOptional()
  passwordConfirmation: string;
}
