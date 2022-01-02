import { define } from 'typeorm-seeding';
import faker from 'faker';

import { VehicleModel } from '@entities/vehicle-model.entity';

define(VehicleModel, () => {
  const vehicleModel = new VehicleModel();

  vehicleModel.make = faker.vehicle.manufacturer();
  vehicleModel.model = faker.vehicle.model();
  vehicleModel.fuel = faker.random.arrayElement([
    'petrol',
    'diesel',
    'hybrid',
    'electric',
  ]);
  vehicleModel.transmission = faker.random.arrayElement([
    'automatic',
    'manual',
  ]);
  vehicleModel.power = faker.datatype.number({
    min: 30,
    max: 200,
  });
  vehicleModel.seats = faker.datatype.number({
    min: 2,
    max: 8,
  });
  vehicleModel.doors = faker.datatype.number({
    min: 2,
    max: 5,
  });

  return vehicleModel;
});
