import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true, description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Enter an email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(200, {
    message: 'The email address must be less than 200 characters',
  })
  email: string;

  @ApiProperty({ required: true, description: 'Nome do usuário' })
  @IsNotEmpty({ message: 'Enter the user name' })
  @MaxLength(200, { message: 'The name must be less than 200 characters' })
  name: string;

  @ApiProperty({ required: true, description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Enter a password' })
  @MaxLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Confirmação de senha do usuário',
  })
  @IsNotEmpty({ message: 'Enter password confirmation' })
  @MaxLength(6, {
    message: 'Password confirmation must be at least 6 characters',
  })
  passwordConfirmation: string;
}
