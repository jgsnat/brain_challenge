import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProducerDto {
  @ApiProperty()
  @IsOptional()
  cpfCnpj: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  state: string;
}
