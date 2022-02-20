export type TJsonOptions = {
  includePrivateData?: boolean;
};

export type TJsonData = {
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
};
