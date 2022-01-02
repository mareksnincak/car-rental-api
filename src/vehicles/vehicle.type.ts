import { TSearchParams as TCommonSearchParams } from '@common/types/search.type';

export enum ESortBy {
  price = 'vehicle.purchasePrice',
  power = 'vehicleModel.power',
}

export enum ETransmission {
  manual = 'manual',
  automatic = 'automatic',
}

export enum EFuel {
  petrol = 'petrol',
  diesel = 'diesel',
  hybrid = 'hybrid',
  electric = 'electric',
}

export type TSearchParams = TCommonSearchParams & {
  sortBy: keyof typeof ESortBy;
  fromDate: Date;
  toDate: Date;
  seatsMin: number;
  seatsMax?: number;
  powerMin: number;
  powerMax?: number;
  transmission: ETransmission[];
  fuel: EFuel[];
};
