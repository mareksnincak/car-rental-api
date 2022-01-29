import { factory } from 'typeorm-seeding';
import { EntityProperty } from 'typeorm-seeding/dist/types';

import { Vehicle } from '@src/db/entities/vehicle.entity';
import { VehicleModel } from '@src/db/entities/vehicle-model.entity';

export const seedVehicle = async ({
  overrideParams = {},
  vehicleModelOverrideParams = {},
}: {
  overrideParams?: EntityProperty<Vehicle>;
  vehicleModelOverrideParams?: EntityProperty<VehicleModel>;
} = {}) => {
  if (!overrideParams.vehicleModel) {
    overrideParams.vehicleModel = await factory(VehicleModel)().create(
      vehicleModelOverrideParams,
    );
  }

  const vehicle = await factory(Vehicle)().create(overrideParams);

  return { vehicle, vehicleModel: overrideParams.vehicleModel };
};
