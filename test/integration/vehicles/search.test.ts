import request from 'supertest';
import { factory, useSeeding } from 'typeorm-seeding';
import dayjs from 'dayjs';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { useMigratedRefreshDatabase } from '@test/utils/typeorm-seeding.utils';
import { User } from '@src/db/entities/user.entity';
import { MOCKED_DATE } from '@test/data/mocks/date.mock';

const url = '/vehicles';

describe(`GET ${url}`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useMigratedRefreshDatabase();
  });

  it('Should return vehicle search result', async () => {
    const user = await factory(User)().create();
    const { vehicle: seededVehicle, vehicleModel: seededVehicleModel } =
      await seedVehicle();

    const response = await request(getTestUrl())
      .get(url)
      .query({ toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

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

  it('Should return paginated vehicles', async () => {
    const user = await factory(User)().create();
    const [{ vehicle: cheapestVehicle }] = await Promise.all([
      seedVehicle({
        overrideParams: { purchasePrice: 10000, mileage: 100000 },
      }),
      seedVehicle({
        overrideParams: { purchasePrice: 20000, mileage: 100000 },
      }),
      seedVehicle({
        overrideParams: { purchasePrice: 30000, mileage: 100000 },
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .query({
        page: 2,
        pageSize: 2,
        sortBy: 'price',
        sortDirection: 'DESC',
        toDate: new Date(),
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const { data: vehicles, pagination } = response.body;

    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(cheapestVehicle.id);

    expect(pagination.page).toEqual(2);
    expect(pagination.pageSize).toEqual(2);
    expect(pagination.totalRecordCount).toEqual(3);
  });

  it('Should filter vehicles by search query', async () => {
    const user = await factory(User)().create();
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
      .query({ query: 'mATch Sho', toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should not return unavailable vehicles', async () => {
    const user = await factory(User)().create();
    await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-10T10:00:00.000Z'),
          toDate: new Date('2022-01-20T10:00:00.000Z'),
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(url)
      .query({
        toDate: '2022-01-10T12:00:00.000Z',
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    expect(response.body.data).toHaveLength(0);
  });

  it('Should return vehicle that was returned sooner', async () => {
    const user = await factory(User)().create();
    await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: dayjs(MOCKED_DATE).add(-2, 'days').toDate(),
          toDate: dayjs(MOCKED_DATE).add(4, 'days').toDate(),
          returnedAt: dayjs(MOCKED_DATE).add(-1, 'day').toDate(),
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(url)
      .query({
        toDate: '2022-01-10T12:00:00.000Z',
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
  });

  it('Should filter vehicles by number of seats', async () => {
    const user = await factory(User)().create();
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
      .query({ seatsMin: 2, seatsMax: 2, toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by power', async () => {
    const user = await factory(User)().create();
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
      .query({ powerMin: 70, powerMax: 90, toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by transmission', async () => {
    const user = await factory(User)().create();
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
      .query({ transmissions: 'manual', toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(1);
    expect(vehicles[0].id).toEqual(vehicleToMatch.vehicle.id);
  });

  it('Should filter vehicles by fuel', async () => {
    const user = await factory(User)().create();
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
      .query({ fuels: 'diesel,electric', toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

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
    const user = await factory(User)().create();
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
      .query({ bodyStyles: 'sedan,hatchback', toDate: new Date() })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const vehicles = response.body.data;
    expect(vehicles.length).toEqual(2);
    expect(vehicles.map((vehicle) => vehicle.id)).toEqual(
      expect.arrayContaining([
        vehicleToMatch1.vehicle.id,
        vehicleToMatch2.vehicle.id,
      ]),
    );
  });

  it('Should calculate price', async () => {
    const driverAge = 30;
    const bookingDays = 1;

    const user = await factory(User)().create({
      dateOfBirth: dayjs(MOCKED_DATE).add(-driverAge, 'years').toDate(),
    });
    const { vehicle: seededVehicle } = await seedVehicle();

    const response = await request(getTestUrl())
      .get(url)
      .query({
        toDate: dayjs(MOCKED_DATE)
          .add(bookingDays, 'days')
          .toDate()
          .toISOString(),
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const { price } = response.body.data[0];

    const expectedTotal = seededVehicle.purchasePrice * 1 * 0.001;
    expect(price.total).toEqual(Number(expectedTotal.toFixed(2)));

    const expectedDeposit =
      seededVehicle.purchasePrice / seededVehicle.mileage / 2 + 1.5 * driverAge;
    expect(price.deposit).toEqual(Number(expectedDeposit.toFixed(2)));
  });
});
