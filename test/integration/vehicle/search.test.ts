import request from 'supertest';
import { useSeeding } from 'typeorm-seeding';
import dayjs from 'dayjs';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { useRefreshDatabaseWithMigrations } from '@test/utils/typeorm-seeding.utils';

const url = '/vehicles';

describe(`GET ${url}`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useRefreshDatabaseWithMigrations();
  });

  it('Should return vehicle', async () => {
    const { vehicle: seededVehicle, vehicleModel: seededVehicleModel } =
      await seedVehicle();

    const response = await request(getTestUrl()).get(url);
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);

    const vehicle = vehicles[0];
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
  });

  it('Should return multiple vehicles', async () => {
    const seededVehicles = await Promise.all([seedVehicle(), seedVehicle()]);

    const response = await request(getTestUrl()).get(url);
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(2);

    expect(vehicles.map((vehicle) => vehicle.id)).toEqual(
      expect.arrayContaining(seededVehicles.map(({ vehicle }) => vehicle.id)),
    );
  });

  it('Should filter vehicles by search query', async () => {
    const [vehicleToMatch] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { make: 'should', model: 'match' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { make: 'dont', model: 'match' },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ query: 'mATch Sho' });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it.skip('Should filter vehicles by availability', async () => {
    // TODO with bookings
  });

  it('Should filter vehicles by number of seats', async () => {
    const [vehicleToMatch] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { seats: 2 },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { seats: 1 },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { seats: 3 },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ seatsMin: 2, seatsMax: 2 });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by power', async () => {
    const [vehicleToMatch] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { power: 80 },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { power: 60 },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { power: 100 },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ powerMin: 70, powerMax: 90 });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by transmission', async () => {
    const [vehicleToMatch] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { transmission: 'manual' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { transmission: 'automatic' },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ transmissions: 'manual' });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by fuel', async () => {
    const [vehicleToMatch1, vehicleToMatch2] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { fuel: 'diesel' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { fuel: 'electric' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { fuel: 'hybrid' },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ fuels: 'diesel,electric' });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(2);
    expect(vehicles.map((vehicle) => vehicle.id)).toEqual(
      expect.arrayContaining([
        vehicleToMatch1.vehicle.id,
        vehicleToMatch2.vehicle.id,
      ]),
    );
  });

  it('Should filter vehicles by body style', async () => {
    const [vehicleToMatch1, vehicleToMatch2] = await Promise.all([
      seedVehicle({
        vehicleModelOverrideParams: { bodyStyle: 'sedan' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { bodyStyle: 'hatchback' },
      }),
      seedVehicle({
        vehicleModelOverrideParams: { bodyStyle: 'liftback' },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({ bodyStyles: 'sedan,hatchback' });
    expect(response.statusCode).toEqual(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(2);
    expect(vehicles.map((vehicle) => vehicle.id)).toEqual(
      expect.arrayContaining([
        vehicleToMatch1.vehicle.id,
        vehicleToMatch2.vehicle.id,
      ]),
    );
  });

  it('Should calculate price when dates and driverAge is specified', async () => {
    const driverAge = 30;
    const bookingDays = 1;

    const { vehicle: seededVehicle } = await seedVehicle();

    const fromDate = '2022-01-10T10:00:00.000Z';
    const response = await request(getTestUrl())
      .get(url)
      .query({
        fromDate,
        toDate: dayjs(fromDate).add(bookingDays, 'days').toDate(),
        driverAge,
      });
    expect(response.statusCode).toEqual(200);

    const { price } = response.body.data[0];

    const expectedTotal = seededVehicle.purchasePrice * 1 * 0.001;
    expect(price.total).toEqual(Number(expectedTotal.toFixed(2)));

    const expectedDeposit =
      seededVehicle.purchasePrice / seededVehicle.mileage / 2 + 1.5 * driverAge;
    expect(price.deposit).toEqual(Number(expectedDeposit.toFixed(2)));
  });
});
