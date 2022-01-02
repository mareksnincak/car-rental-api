export type TBookingParams = {
  vehicleId: string;
  fromDate: Date;
  toDate: Date;
  driver: {
    name: string;
    age: number;
  };
};
