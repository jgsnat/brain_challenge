import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { CulturePlanted } from '../../../common/culture-planted.enum';

export class CreateFarmDto {
  @ApiProperty({ required: true, description: 'Nome da fazenda' })
  @IsNotEmpty({ message: 'Enter the farm name' })
  @MaxLength(180, { message: 'The name must be less than 180 characters' })
  name: string;

  @ApiProperty({ required: true, description: 'Cidade da fazenda' })
  @IsNotEmpty({ message: 'Enter a city' })
  @MaxLength(150, { message: 'City must be at least 150 characters' })
  city: string;

  @ApiProperty({ required: true, description: 'Estado da fazenda' })
  @IsNotEmpty({ message: 'Enter a state' })
  @MaxLength(2, { message: 'State must be at least 2 characters' })
  state: string;

  @ApiProperty({
    required: true,
    description: 'Área total da fazenda em hectares',
  })
  @IsNotEmpty({ message: 'Enter a totalArea' })
  @IsNumber()
  totalArea: number;

  @ApiProperty({
    required: true,
    description: 'Área total agricultável da fazenda em hectares',
  })
  @IsNotEmpty({ message: 'Enter a totalAreaArable' })
  @IsNumber()
  totalAreaArable: number;

  @ApiProperty({
    required: true,
    description: 'Área total de vegetação da fazenda em hectares',
  })
  @IsNotEmpty({ message: 'Enter a totalAreaVegetation' })
  @IsNumber()
  totalAreaVegetation: number;

  @ApiProperty({
    required: true,
    description: 'Culturas plantadas na fazenda',
    enum: CulturePlanted,
    isArray: true,
  })
  @IsNotEmpty({ message: 'Enter a culturePlanted' })
  @IsEnum(CulturePlanted, {
    message: 'Enter a culturePlanted type',
    each: true,
  })
  culturePlanted: CulturePlanted[];
}
