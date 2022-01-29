import request from 'supertest';
import { useRefreshDatabase, useSeeding } from 'typeorm-seeding';
import dayjs from 'dayjs';
import faker from 'faker';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';

const url = '/vehicles';

describe(`GET ${url}/:id`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useRefreshDatabase();
  });

  it('Should return vehicle detail', async () => {
    const { vehicle: seededVehicle, vehicleModel: seededVehicleModel } =
      await seedVehicle();

    const response = await request(getTestUrl())
      .get(`${url}/${seededVehicle.id}`)
      .expect(200);

    const { vehicle, bookings } = response.body;

    expect(vehicle.id).toEqual(seededVehicle.id);
    expect(vehicle.color).toEqual(seededVehicle.color);
    expect(vehicle.year).toEqual(seededVehicle.year);
    expect(vehicle.mileage).toEqual(seededVehicle.mileage);
    expect(vehicle.make).toEqual(seededVehicleModel.make);
    expect(vehicle.model).toEqual(seededVehicleModel.model);
    expect(vehicle.fuel).toEqual(seededVehicleModel.fuel);
    expect(vehicle.transmission).toEqual(seededVehicleModel.transmission);
    expect(vehicle.bodyStyle).toEqual(seededVehicleModel.bodyStyle);
    expect(vehicle.power).toEqual(seededVehicleModel.power);
    expect(vehicle.seats).toEqual(seededVehicleModel.seats);
    expect(vehicle.doors).toEqual(seededVehicleModel.doors);
    expect(vehicle.imageUrl).toEqual(seededVehicleModel.imageUrl);
    expect(vehicle.price).toEqual(null);

    expect(bookings).toEqual([]);
  });

  it('Should return error when vehicle does not exist', async () => {
    const nonExistentId = faker.datatype.uuid();

    const response = await request(getTestUrl())
      .get(`${url}/${nonExistentId}`)
      .expect(400);

    const { code, type, detail } = response.body;
    expect(code).toEqual(2000);
    expect(type).toEqual('not_found');
    expect(detail).toEqual({
      resource: 'Vehicle',
    });
  });

  it('Should return future vehicle bookings', async () => {
    const { vehicle: seededVehicle } = await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: new Date('2021-01-10T10:00:00.000Z'),
          toDate: new Date('2021-01-20T10:00:00.000Z'),
        },
        {
          fromDate: new Date('2022-01-10T10:00:00.000Z'),
          toDate: new Date('2022-01-20T10:00:00.000Z'),
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(`${url}/${seededVehicle.id}`)
      .expect(200);

    const { bookings } = response.body;
    expect(bookings.length).toEqual(1);

    const booking = bookings[0];
    expect(booking.fromDate).toEqual('2022-01-10T10:00:00.000Z');
    expect(booking.toDate).toEqual('2022-01-20T10:00:00.000Z');
  });

  it('Should calculate price when dates and driverAge is specified', async () => {
    const driverAge = 30;
    const bookingDays = 1;

    const { vehicle: seededVehicle } = await seedVehicle();

    const fromDate = '2022-01-10T10:00:00.000Z';
    const response = await request(getTestUrl())
      .get(`${url}/${seededVehicle.id}`)
      .query({
        fromDate,
        toDate: dayjs(fromDate).add(bookingDays, 'days').toDate().toISOString(),
        driverAge,
      })
      .expect(200);

    const { price } = response.body.vehicle;

    const expectedTotal = seededVehicle.purchasePrice * 1 * 0.001;
    expect(price.total).toEqual(Number(expectedTotal.toFixed(2)));

    const expectedDeposit =
      seededVehicle.purchasePrice / seededVehicle.mileage / 2 + 1.5 * driverAge;
    expect(price.deposit).toEqual(Number(expectedDeposit.toFixed(2)));
  });
});
