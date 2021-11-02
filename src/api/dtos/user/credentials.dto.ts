import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({ required: true, description: 'Email do usuário' })
  email: string;

  @ApiProperty({ required: true, description: 'Senha do usuário' })
  password: string;
}
