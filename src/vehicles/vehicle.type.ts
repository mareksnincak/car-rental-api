import { TSearchParams as TCommonSearchParams } from '@common/types/search.type';

export enum ESortBy {
  model = 'vehicleModel.model',
}

export type TSearchParams = TCommonSearchParams & {
  sortBy: ESortBy;
};
