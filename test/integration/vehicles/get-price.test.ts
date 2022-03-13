import request from 'supertest';
import { factory, useRefreshDatabase, useSeeding } from 'typeorm-seeding';
import dayjs from 'dayjs';
import faker from 'faker';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { User } from '@src/db/entities/user.entity';

const url = '/vehicles/price';

describe(`GET ${url}/:id`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useRefreshDatabase();
  });

  it('Should calculate price', async () => {
    const driverAge = 30;
    const bookingDays = 1;

    const user = await factory(User)().create();
    const { vehicle: seededVehicle } = await seedVehicle();

    const fromDate = '2022-01-10T10:00:00.000Z';
    const response = await request(getTestUrl())
      .get(`${url}/${seededVehicle.id}`)
      .query({
        fromDate,
        toDate: dayjs(fromDate).add(bookingDays, 'days').toDate().toISOString(),
        driverAge,
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const price = response.body;

    const expectedTotal = seededVehicle.purchasePrice * 1 * 0.001;
    expect(price.total).toEqual(Number(expectedTotal.toFixed(2)));

    const expectedDeposit =
      seededVehicle.purchasePrice / seededVehicle.mileage / 2 + 1.5 * driverAge;
    expect(price.deposit).toEqual(Number(expectedDeposit.toFixed(2)));
  });

  it('Should return error when vehicle does not exist', async () => {
    const nonExistentId = faker.datatype.uuid();
    const user = await factory(User)().create();

    const response = await request(getTestUrl())
      .get(`${url}/${nonExistentId}`)
      .query({
        fromDate: '2022-01-10T10:00:00.000Z',
        toDate: '2022-01-11T10:00:00.000Z',
        driverAge: 30,
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
