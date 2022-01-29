import { define } from 'typeorm-seeding';
import faker from 'faker';

import { Booking } from '../entities/booking.entity';
import dayjs from 'dayjs';

define(Booking, () => {
  const booking = new Booking();

  const fromDate = faker.date.future();
  booking.fromDate = fromDate;
  booking.toDate = dayjs(fromDate)
    .add(faker.datatype.number(30), 'days')
    .toDate();
  booking.priceTotal = faker.datatype.number(500);
  booking.priceDeposit = faker.datatype.number(500);
  booking.driverAge = faker.datatype.number(70);
  booking.driverName = faker.random.words(2);

  return booking;
});
