import { User } from '@src/db/entities/user.entity';

export type TCreateBookingParams = {
  user: User;
  vehicleId: string;
  fromDate: Date;
  toDate: Date;
};
