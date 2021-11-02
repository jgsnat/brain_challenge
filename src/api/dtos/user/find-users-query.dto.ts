import { BaseQueryParametersDto } from '../../../common/base-query-parameters.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  @ApiProperty({
    required: false,
    description: 'Nome do usuário',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    required: false,
    description: 'Permissão de acesso do usuário',
  })
  role: string;
}
