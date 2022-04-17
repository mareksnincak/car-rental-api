import { TSearchParams as TCommonSearchParams } from '@common/types/search.type';
import {
  ESortBy,
  BODY_STYLES,
  FUELS,
  TRANSMISSIONS,
} from './vehicle.constants';

export type TTransmission = typeof TRANSMISSIONS[number];
export type TFuel = typeof FUELS[number];
export type TBodyStyle = typeof BODY_STYLES[number];

export type TSearchParams = TCommonSearchParams & {
  sortBy: keyof typeof ESortBy;
  fromDate?: Date;
  toDate?: Date;
  seatsMin: number;
  seatsMax?: number;
  powerMin: number;
  powerMax?: number;
  transmissions: readonly TTransmission[];
  fuels: readonly TFuel[];
  bodyStyles: readonly TBodyStyle[];
};
