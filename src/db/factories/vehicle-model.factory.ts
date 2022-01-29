import { define } from 'typeorm-seeding';
import faker from 'faker';

import { VehicleModel } from '@entities/vehicle-model.entity';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from '@vehicles/vehicle.constants';

define(VehicleModel, () => {
  const vehicleModel = new VehicleModel();

  vehicleModel.make = faker.vehicle.manufacturer();
  vehicleModel.model = faker.vehicle.model();
  vehicleModel.fuel = faker.random.arrayElement(FUELS);
  vehicleModel.transmission = faker.random.arrayElement(TRANSMISSIONS);
  vehicleModel.bodyStyle = faker.random.arrayElement(BODY_STYLES);
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
  vehicleModel.imageUrl = faker.internet.url();

  return vehicleModel;
});
