export type TJsonOptions = {
  includePrivateData?: boolean;
};

export type TJsonData = {
  fromDate: Date;
  toDate: Date;
  id?: string;
  price?: number;
  vehicleId?: string;
};
