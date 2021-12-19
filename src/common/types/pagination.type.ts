export enum ESortDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export type TPagination = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: ESortDirection.asc | ESortDirection.desc;
};
