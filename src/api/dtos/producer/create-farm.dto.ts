import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Enter the farm name' })
  @MaxLength(180, { message: 'The name must be less than 180 characters' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a city' })
  @MaxLength(150, { message: 'City must be at least 150 characters' })
  city: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a state' })
  @MaxLength(2, { message: 'State must be at least 2 characters' })
  state: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a totalArea' })
  @IsNumber()
  totalArea: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a totalAreaArable' })
  @IsNumber()
  totalAreaArable: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a totalAreaVegetation' })
  @IsNumber()
  totalAreaVegetation: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter a culturePlanted' })
  culturePlanted: string[];
}
