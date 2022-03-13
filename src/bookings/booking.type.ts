export type TCreateBookingParams = {
  userId: string;
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
