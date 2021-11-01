import { BaseQueryParametersDto } from '../../../common/base-query-parameters.dto';

export class FindProducersQueryDto extends BaseQueryParametersDto {
  cpfCnpj: string;
  name: string;
  city: string;
  state: string;
  isActive: boolean;
}
