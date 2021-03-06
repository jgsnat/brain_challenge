import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { CreateFarmDto } from './create-farm.dto';

export class CreateProducerDto {
  @ApiProperty({
    required: true,
    description: 'CPF ou CNPJ do produtor',
    pattern: '^\\d{11}$|^\\d{14}$',
  })
  @IsNotEmpty({ message: 'Enter an cpfCnpj address' })
  @MinLength(11, {
    message: 'The cpfCnpj address must have at least 11 characters',
  })
  @MaxLength(14, {
    message: 'The cpfCnpj address must be less than 14 characters',
  })
  @Matches(/^\d{11}$|^\d{14}$/, { message: 'Enter an cpfCnpj valid' })
  cpfCnpj: number;

  @ApiProperty({ required: true, description: 'Nome do produtor' })
  @IsNotEmpty({ message: 'Enter the producer name' })
  @MaxLength(180, { message: 'The name must be less than 180 characters' })
  name: string;

  @ApiProperty({ required: false, description: 'Cidade do produtor' })
  @IsNotEmpty({ message: 'Enter a city' })
  @MaxLength(150, { message: 'City must be at least 150 characters' })
  city: string;

  @ApiProperty({ required: false, description: 'Estado do produtor' })
  @IsNotEmpty({ message: 'Enter a state' })
  @MaxLength(2, { message: 'State must be at least 2 characters' })
  state: string;

  @ApiProperty({
    required: true,
    description: 'Fazendas do produtor',
    type: CreateFarmDto,
    isArray: true,
  })
  @IsNotEmpty({ message: 'Enter a farm' })
  farms: CreateFarmDto[];
}
