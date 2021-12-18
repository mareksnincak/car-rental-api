import { Factory, Seeder } from 'typeorm-seeding';
import faker from 'faker';

import { Vehicle } from '@entities/vehicle.entity';
import { VehicleModel } from '@entities/vehicle-model.entity';

const SEEDED_VEHICLE_MODELS_COUNT = 100;
const SEEDED_VEHICLES_COUNT = 1000;

export default class VehicleSeeder implements Seeder {
  public async run(factory: Factory) {
    const vehicleModels = await factory(VehicleModel)().createMany(
      SEEDED_VEHICLE_MODELS_COUNT,
    );

    await factory(Vehicle)()
      .map(async (vehicle) => {
        vehicle.vehicleModel = faker.random.arrayElement(vehicleModels);
        return vehicle;
      })
      .createMany(SEEDED_VEHICLES_COUNT);
  }
}
