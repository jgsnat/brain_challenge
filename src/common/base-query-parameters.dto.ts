import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseQueryParametersDto {
  @ApiProperty({
    required: false,
    description: 'Campo para ordenação da paginação',
  })
  sort: string;

  @ApiProperty({
    required: false,
    description: 'Número da página para paginação',
  })
  page: number;

  @ApiProperty({
    required: false,
    description: 'Limite de itens por página para paginação',
  })
  limit: number;

  @ApiProperty({
    required: false,
    description: 'Status de ativo/inativo (exclusão lógica) de um item buscado',
  })
  isActive: boolean;
}

export const clearQueryParams = (queryParams) => {
  queryParams.isActive =
    queryParams.isActive === undefined ? true : queryParams.isActive;
  queryParams.page =
    queryParams.page < 1 || queryParams.page === undefined
      ? 1
      : queryParams.page;
  queryParams.limit =
    queryParams.limit > 100 || queryParams.limit === undefined
      ? 100
      : queryParams.limit;
};
