import { BaseQueryParametersDto } from '../../../common/base-query-parameters.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindProducersQueryDto extends BaseQueryParametersDto {
  @ApiProperty({
    required: false,
    description: 'CPF ou CNPJ do produtor',
    pattern: '^\\d{11}$|^\\d{14}$',
  })
  cpfCnpj: string;

  @ApiProperty({
    required: false,
    description: 'Nome do produtor',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Cidade do produtor',
  })
  city: string;

  @ApiProperty({
    required: false,
    description: 'Estado do produtor',
  })
  state: string;
}
