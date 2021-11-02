import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateFarmDto } from './create-farm.dto';

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

  @ApiProperty()
  @IsOptional()
  farms: CreateFarmDto[];
}
