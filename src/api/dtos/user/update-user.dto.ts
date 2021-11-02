import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/auth/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    required: true,
    description: 'Email do usuário',
    nullable: true,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Nome do usuário',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Please provide a valid username' })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Permissão de acesso do usuário',
    enum: UserRole,
    nullable: true,
  })
  @IsOptional()
  role: UserRole;

  @ApiProperty({
    required: true,
    description: 'Senha do usuário',
    nullable: true,
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    required: true,
    description: 'Confirmação de senha do usuário',
    nullable: true,
  })
  @IsOptional()
  passwordConfirmation: string;
}
