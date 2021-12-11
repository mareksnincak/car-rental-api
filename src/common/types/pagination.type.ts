export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export type TPagination = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection.asc | SortDirection.desc;
};
