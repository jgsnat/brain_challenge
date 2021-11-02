import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateFarmDto } from './create-farm.dto';

export class UpdateProducerDto {
  @ApiProperty({
    required: true,
    description: 'CPF ou CNPJ do produtor',
    nullable: true,
  })
  @IsOptional()
  cpfCnpj: string;

  @ApiProperty({
    required: true,
    description: 'Nome do produtor',
    nullable: true,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Cidade do produtor',
    nullable: true,
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    required: false,
    description: 'Estado do produtor',
    nullable: true,
  })
  @IsOptional()
  state: string;

  @ApiProperty({
    required: true,
    description: 'Fazendas do produtor',
    type: CreateFarmDto,
    isArray: true,
    nullable: true,
  })
  @IsOptional()
  farms: CreateFarmDto[];
}
