export type TJsonOptions = {
  includePrivateData?: boolean;
};

export type TJsonData = {
  from: Date;
  to: Date;
  id?: string;
  price?: number;
  vehicleId?: string;
};
