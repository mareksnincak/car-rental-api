import request from 'supertest';
import { factory, useSeeding } from 'typeorm-seeding';

import { getTestUrl } from '@test/utils/app.utils';
import { seedVehicle } from '@test/db/seeders/vehicle.seeder';
import { useMigratedRefreshDatabase } from '@test/utils/typeorm-seeding.utils';
import { User } from '@src/db/entities/user.entity';

const url = '/bookings';

describe(`POST ${url}`, () => {
  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    await useMigratedRefreshDatabase();
  });

  it('Should get bookings', async () => {
    const user = await factory(User)().create();
    const {
      vehicle: seededVehicle,
      vehicleModel: seededVehicleModel,
      bookings: seededBookings,
    } = await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-17T06:00:00.000Z'),
          toDate: new Date('2022-01-18T10:00:00.000Z'),
          userId: user.id,
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(url)
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const bookings = response.body.data;
    expect(bookings).toHaveLength(1);

    const booking = bookings[0];
    const seededBooking = seededBookings[0];

    expect(booking.id).toEqual(seededBooking.id);
    expect(booking.fromDate).toEqual(seededBooking.fromDate.toISOString());
    expect(booking.toDate).toEqual(seededBooking.toDate.toISOString());
    expect(booking.returnedAt).toEqual(
      seededBooking.returnedAt?.toISOString() ?? null,
    );

    const { price, driver, vehicle } = booking;
    expect(price.total).toEqual(seededBooking.priceTotal);
    expect(price.deposit).toEqual(seededBooking.priceDeposit);

    expect(driver.name).toEqual(seededBooking.driverName);
    expect(driver.age).toEqual(seededBooking.driverAge);
    expect(driver.email).toEqual(seededBooking.driverEmail);
    expect(driver.idNumber).toEqual(seededBooking.driverIdNumber);

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
  });

  it('Should get multiple bookings', async () => {
    const user = await factory(User)().create();
    await Promise.all([
      seedVehicle({
        bookingsOverrideParams: [
          {
            id: '00f018b3-84d2-4fd9-bbee-471741c7d801',
            fromDate: new Date('2022-01-17T06:00:00.000Z'),
            toDate: new Date('2022-01-18T10:00:00.000Z'),
            userId: user.id,
          },
          {
            id: '00f018b3-84d2-4fd9-bbee-471741c7d802',
            fromDate: new Date('2022-02-17T06:00:00.000Z'),
            toDate: new Date('2022-02-18T10:00:00.000Z'),
            userId: user.id,
          },
        ],
      }),
      seedVehicle({
        bookingsOverrideParams: [
          {
            id: '00f018b3-84d2-4fd9-bbee-471741c7d803',
            fromDate: new Date('2022-03-17T06:00:00.000Z'),
            toDate: new Date('2022-03-18T10:00:00.000Z'),
            userId: user.id,
          },
        ],
      }),
    ]);

    const response = await request(getTestUrl())
      .get(url)
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const bookings = response.body.data;
    expect(bookings).toHaveLength(3);
    expect(bookings.map((booking: { id: string }) => booking.id)).toEqual([
      '00f018b3-84d2-4fd9-bbee-471741c7d801',
      '00f018b3-84d2-4fd9-bbee-471741c7d802',
      '00f018b3-84d2-4fd9-bbee-471741c7d803',
    ]);
  });

  it('Should return paginated bookings', async () => {
    const user = await factory(User)().create();
    await seedVehicle({
      bookingsOverrideParams: [
        {
          id: '00f018b3-84d2-4fd9-bbee-471741c7d803',
          fromDate: new Date('2022-03-17T06:00:00.000Z'),
          toDate: new Date('2022-03-18T10:00:00.000Z'),
          userId: user.id,
        },
        {
          id: '00f018b3-84d2-4fd9-bbee-471741c7d801',
          fromDate: new Date('2022-01-17T06:00:00.000Z'),
          toDate: new Date('2022-01-18T10:00:00.000Z'),
          userId: user.id,
        },
        {
          id: '00f018b3-84d2-4fd9-bbee-471741c7d802',
          fromDate: new Date('2022-02-17T06:00:00.000Z'),
          toDate: new Date('2022-02-18T10:00:00.000Z'),
          userId: user.id,
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(url)
      .query({
        page: 2,
        pageSize: 2,
        sortBy: 'fromDate',
        sortDirection: 'DESC',
      })
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const { data: bookings, pagination } = response.body;

    expect(bookings.length).toEqual(1);
    expect(bookings[0].id).toEqual('00f018b3-84d2-4fd9-bbee-471741c7d801');

    expect(pagination.page).toEqual(2);
    expect(pagination.pageSize).toEqual(2);
    expect(pagination.totalRecordCount).toEqual(3);
  });

  it("Should not get other user's bookings", async () => {
    const [user, otherUser] = await factory(User)().createMany(2);
    await seedVehicle({
      bookingsOverrideParams: [
        {
          fromDate: new Date('2022-01-17T06:00:00.000Z'),
          toDate: new Date('2022-01-18T10:00:00.000Z'),
          userId: otherUser.id,
        },
      ],
    });

    const response = await request(getTestUrl())
      .get(url)
      .set({ 'Api-Key': user.apiKey })
      .expect(200);

    const bookings = response.body.data;
    expect(bookings).toHaveLength(0);
  });
});
