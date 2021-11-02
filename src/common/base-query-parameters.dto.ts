export abstract class BaseQueryParametersDto {
  sort: string;
  page: number;
  limit: number;
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
