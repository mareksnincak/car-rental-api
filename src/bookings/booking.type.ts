export type TCreateBookingParams = {
  vehicleId: string;
  fromDate: Date;
  toDate: Date;
  driver: {
    name: string;
    age: number;
    email: string;
    idNumber: string;
  };
};
