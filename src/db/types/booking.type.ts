import { TVehicleJson } from './vehicle.type';

export type TJsonOptions = {
  includePrivateData?: boolean;
  includeVehicle?: boolean;
};

export type TBookingJson = {
  fromDate: Date;
  toDate: Date;
  id?: string;
  vehicleId?: string;
  price?: {
    total: number;
    deposit: number;
  };
  driver?: {
    name: string;
    age: number;
    email: string;
    idNumber: string;
  };
  vehicle?: TVehicleJson;
  returnedAt?: Date | null;
};
