import { factory } from 'typeorm-seeding';
import { EntityProperty } from 'typeorm-seeding/dist/types';

import { Vehicle } from '@src/db/entities/vehicle.entity';
import { VehicleModel } from '@src/db/entities/vehicle-model.entity';
import { Booking } from '@src/db/entities/booking.entity';

export const seedVehicle = async ({
  overrideParams = {},
  vehicleModelOverrideParams = {},
  bookingsOverrideParams = [],
}: {
  overrideParams?: EntityProperty<Vehicle>;
  vehicleModelOverrideParams?: EntityProperty<VehicleModel>;
  bookingsOverrideParams?: EntityProperty<Booking>[];
} = {}) => {
  if (!overrideParams.vehicleModel) {
    overrideParams.vehicleModel = await factory(VehicleModel)().create(
      vehicleModelOverrideParams,
    );
  }

  const vehicle = await factory(Vehicle)().create(overrideParams);

  let bookings: Booking[] = [];
  if (bookingsOverrideParams.length) {
    const bookingsToCreate = bookingsOverrideParams.map((overrideParams) =>
      factory(Booking)().create({ ...overrideParams, vehicle }),
    );

    bookings = await Promise.all(bookingsToCreate);
  }

  return { vehicle, vehicleModel: overrideParams.vehicleModel, bookings };
};
