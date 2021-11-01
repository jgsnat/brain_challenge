import { BaseQueryParametersDto } from '../../../common/base-query-parameters.dto';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  name: string;
  email: string;
  isActive: boolean;
  role: string;
}
