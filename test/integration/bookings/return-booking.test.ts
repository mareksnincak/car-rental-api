import request from 'supertest';
import { factory, useRefreshDatabase, useSeeding } from 'typeorm-seeding';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { User } from '@src/db/entities/user.entity';
import { MOCKED_DATE } from '@test/data/mocks/date.mock';
import dayjs from 'dayjs';
import faker from 'faker';
import { getRepository } from 'typeorm';
import { Booking } from '@src/db/entities/booking.entity';

const url = '/bookings/returns';

describe(`POST ${url}`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useRefreshDatabase();
  });

  it('Should return booked vehicle', async () => {
    const bookingDays = 10;
    const purchasePrice = 10000;

    const user = await factory(User)().create();
    const { bookings: seededBookings, vehicle } = await seedVehicle({
      overrideParams: {
        purchasePrice,
      },
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-01T08:00:00.000Z'),
          toDate: dayjs('2022-01-01T08:00:00.000Z')
            .add(bookingDays, 'days')
            .toDate(),
          userId: user.id,
          returnedAt: null,
        },
      ],
    });
    const seededBooking = seededBookings[0];

    const response = await request(getTestUrl())
      .post(url)
      .send({
        id: seededBooking.id,
        mileage: vehicle.mileage + 1,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const booking = response.body;
    expect(booking.id).toEqual(seededBooking.id);
    expect(booking.fromDate).toEqual(seededBooking.fromDate.toISOString());
    expect(booking.toDate).toEqual(seededBooking.toDate.toISOString());
    expect(booking.returnedAt).toEqual(MOCKED_DATE);

    const expectedTotalPrice = purchasePrice * bookingDays * 0.001;
    const { price, driver } = booking;
    expect(price.total).toEqual(expectedTotalPrice);
    expect(price.deposit).toEqual(seededBooking.priceDeposit);

    expect(driver.name).toEqual(seededBooking.driverName);
    expect(driver.age).toEqual(seededBooking.driverAge);
    expect(driver.email).toEqual(seededBooking.driverEmail);
    expect(driver.idNumber).toEqual(seededBooking.driverIdNumber);

    const bookingRecord = await getRepository(Booking).findOneOrFail();
    expect(bookingRecord.priceTotal).toEqual(expectedTotalPrice);
    expect(bookingRecord.returnedAt).toEqual(new Date(MOCKED_DATE));
  });

  it('Should apply return fine', async () => {
    const bookingDays = 10;
    const delayDays = 2;
    const fromDate = dayjs(MOCKED_DATE)
      .add(-(bookingDays + delayDays), 'days')
      .toDate();
    const purchasePrice = 10000;

    const user = await factory(User)().create();
    const { bookings: seededBookings, vehicle } = await seedVehicle({
      overrideParams: {
        purchasePrice,
      },
      bookingsOverrideParams: [
        {
          fromDate,
          toDate: dayjs(fromDate).add(bookingDays, 'days').toDate(),
          userId: user.id,
          returnedAt: null,
        },
      ],
    });
    const seededBooking = seededBookings[0];

    const response = await request(getTestUrl())
      .post(url)
      .send({
        id: seededBooking.id,
        mileage: vehicle.mileage + 1,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    expect(response.body.price.total).toEqual(
      purchasePrice * bookingDays * 0.001 + delayDays * 100,
    );
  });

  it('Should apply discount when users previous bookings cost is high enough', async () => {
    const bookingDays = 10;
    const purchasePrice = 10000;

    const user = await factory(User)().create();
    const { bookings: seededBookings, vehicle } = await seedVehicle({
      overrideParams: {
        purchasePrice,
      },
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-01T08:00:00.000Z'),
          toDate: dayjs('2022-01-01T08:00:00.000Z')
            .add(bookingDays, 'days')
            .toDate(),
          userId: user.id,
          returnedAt: null,
        },
        {
          userId: user.id,
          returnedAt: new Date('2021-01-02T08:00:00.000Z'),
          priceTotal: 2500,
        },
      ],
    });
    const seededBooking = seededBookings[0];

    const response = await request(getTestUrl())
      .post(url)
      .send({
        id: seededBooking.id,
        mileage: vehicle.mileage + 1,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    expect(response.body.price.total).toEqual(
      purchasePrice * bookingDays * 0.001 * 0.98,
    );
  });

  it.skip('Should throw error when reported vehicle mileage is lower then before', async () => {
    const [user, otherUser] = await factory(User)().createMany(2);
    const { bookings: seededBookings } = await seedVehicle({
      overrideParams: {
        mileage: 100000,
      },
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-01T08:00:00.000Z'),
          toDate: new Date('2022-02-01T08:00:00.000Z'),
          userId: otherUser.id,
        },
      ],
    });

    await request(getTestUrl())
      .post(url)
      .send({
        id: seededBookings[0].id,
        mileage: 90000,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(400);
  });

  it('Should return error when booking does not exist', async () => {
    const user = await factory(User)().create();

    const response = await request(getTestUrl())
      .post(url)
      .send({
        id: faker.datatype.uuid(),
        mileage: 100000,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(400);

    const { code, type, detail } = response.body;
    expect(code).toEqual(2000);
    expect(type).toEqual('not_found');
    expect(detail.resource).toEqual('Booking');
  });
});
