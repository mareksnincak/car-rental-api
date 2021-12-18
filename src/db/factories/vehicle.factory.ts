import { define } from 'typeorm-seeding';
import faker from 'faker';

import { Vehicle } from '@entities/vehicle.entity';

define(Vehicle, () => {
  const vehicle = new Vehicle();

  vehicle.vin = faker.vehicle.vin();
  vehicle.color = faker.vehicle.color();
  vehicle.year = faker.datatype.number({
    min: 2000,
    max: new Date().getFullYear(),
  });
  vehicle.mileage = faker.datatype.number(300000);
  vehicle.purchasePrice = faker.datatype.number({
    min: 10000,
    max: 25000,
  });

  return vehicle;
});
