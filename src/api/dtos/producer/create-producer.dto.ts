import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Enter an cpfCnpj address' })
  @MinLength(11,{ message: 'The cpfCnpj address must have at least 11 characters ' })
  @MaxLength(14, { message: 'The cpfCnpj address must be less than 14 characters' })
  cpfCnpj: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter the producer name' })
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
}
