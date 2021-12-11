import { TPagination } from './pagination.type';

export type TSearchParams = TPagination & {
  query?: string;
};
