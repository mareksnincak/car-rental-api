import request from 'supertest';
import { factory, useSeeding } from 'typeorm-seeding';
import { getRepository } from 'typeorm';
import faker from 'faker';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { Booking } from '@src/db/entities/booking.entity';
import { useMigratedRefreshDatabase } from '@test/utils/typeorm-seeding.utils';
import { User } from '@src/db/entities/user.entity';
import { MOCKED_DATE } from '@test/data/mocks/date.mock';
import dayjs from 'dayjs';

const url = '/bookings';

describe(`POST ${url}`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useMigratedRefreshDatabase();
  });

  it('Should create booking', async () => {
    const bookingDays = 4;
    const driverAge = 20;
    const toDate = dayjs(MOCKED_DATE).add(4, 'days').toISOString();

    const user = await factory(User)().create({
      dateOfBirth: dayjs(MOCKED_DATE).add(-driverAge, 'years').toDate(),
    });
    const { vehicle: seededVehicle } = await seedVehicle();

    const response = await request(getTestUrl())
      .post(url)
      .send({
        vehicleId: seededVehicle.id,
        toDate,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(201);

    const bookingRepository = getRepository(Booking);

    const expectedTotal = Number(
      (seededVehicle.purchasePrice * bookingDays * 0.001).toFixed(2),
    );

    const expectedDeposit = Number(
      (
        seededVehicle.purchasePrice / seededVehicle.mileage / 2 +
        1.5 * driverAge
      ).toFixed(2),
    );

    const bookingResponse = response.body;
    expect(bookingResponse.id).toBeTruthy();
    expect(new Date(bookingResponse.fromDate).getTime()).toEqual(
      new Date(MOCKED_DATE).getTime(),
    );
    expect(new Date(bookingResponse.toDate).getTime()).toEqual(
      new Date(toDate).getTime(),
    );
    expect(bookingResponse.price.deposit).toEqual(expectedDeposit);
    expect(bookingResponse.price.total).toEqual(expectedTotal);

    const booking = await bookingRepository.findOne({
      id: bookingResponse.id,
      user,
    });
    expect(booking).toBeTruthy();
    expect(booking.fromDate.getTime()).toEqual(new Date(MOCKED_DATE).getTime());
    expect(booking.toDate.getTime()).toEqual(new Date(toDate).getTime());
    expect(booking.priceDeposit).toEqual(expectedDeposit);
    expect(booking.priceTotal).toEqual(expectedTotal);
  });

  it('Allow to book vehicle that was returned sooner', async () => {
    const user = await factory(User)().create();
    const { vehicle: seededVehicle } = await seedVehicle({
      bookingsOverrideParams: [
        {
          userId: user.id,
          fromDate: dayjs(MOCKED_DATE).add(-2, 'days').toDate(),
          toDate: dayjs(MOCKED_DATE).add(4, 'days').toDate(),
          returnedAt: dayjs(MOCKED_DATE).add(-1, 'day').toDate(),
        },
      ],
    });

    await request(getTestUrl())
      .post(url)
      .send({
        vehicleId: seededVehicle.id,
        toDate: dayjs(MOCKED_DATE).add(4, 'days').toDate(),
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(201);
  });

  it("Should return error when vehicle isn't available", async () => {
    const user = await factory(User)().create();
    const { vehicle: seededVehicle } = await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-17T06:00:00.000Z'),
          toDate: new Date('2022-01-18T10:00:00.000Z'),
        },
      ],
    });

    const response = await request(getTestUrl())
      .post(url)
      .send({
        vehicleId: seededVehicle.id,
        toDate: '2022-01-17T10:00:00.000Z',
        driver: {
          name: 'Test Driver',
          age: 18,
          email: 'test.driver@example.com',
          idNumber: 'EC123456',
        },
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(400);

    const { code, type, detail } = response.body;
    expect(code).toEqual(2001);
    expect(type).toEqual('conflict');
    expect(detail).toEqual({
      resource: 'Booking',
    });
  });

  it('Should return error when vehicle does not exist', async () => {
    const nonExistentId = faker.datatype.uuid();
    const user = await factory(User)().create();

    const response = await request(getTestUrl())
      .post(url)
      .send({
        vehicleId: nonExistentId,
        toDate: '2022-01-11T10:00:00.000Z',
        driver: {
          name: 'Test Driver',
          age: 18,
          email: 'test.driver@example.com',
          idNumber: 'EC123456',
        },
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(400);

    const { code, type, detail } = response.body;
    expect(code).toEqual(2000);
    expect(type).toEqual('not_found');
    expect(detail).toEqual({
      resource: 'Vehicle',
    });
  });
});
