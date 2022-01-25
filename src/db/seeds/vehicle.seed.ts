import { Factory, Seeder } from 'typeorm-seeding';
import faker from 'faker';

import { Vehicle } from '@entities/vehicle.entity';
import { VehicleModel } from '@entities/vehicle-model.entity';

const SEEDED_VEHICLE_MODELS_COUNT = 100;
const SEEDED_VEHICLES_COUNT = 1000;

/**
 * For simplicity we don't use presigned urls, but it would be good idea in real scenario
 */
const IMAGE_URLS = [
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2014-peugeot-208-allure-5door-hatchback-black.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2015-skoda-octavia-ambition-hatchback-grey.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2015-skoda-octavia-ambition-wagon-white.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2016-peugeot-308-gti-5door-hatchback-beige.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2016-skoda-fabia-monte-carlo-hatchback-white.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2016-volkswagen-golf-4dr-hatchback-white.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2016-volkswagen-polo-blue-gt-5door-hatchback-white.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2017-renault-clio-intens-5door-hatchback-silver.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2019-bmw-3-series-m-sport-sedan-black.webp',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-rental/2019-ford-mondeo-vignale-sedan-black.webp',
];

export default class VehicleSeeder implements Seeder {
  public async run(factory: Factory) {
    const vehicleModels = await factory(VehicleModel)()
      .map(async (vehicleModel) => {
        vehicleModel.imageUrl = faker.random.arrayElement(IMAGE_URLS);
        return vehicleModel;
      })
      .createMany(SEEDED_VEHICLE_MODELS_COUNT);

    await factory(Vehicle)()
      .map(async (vehicle) => {
        vehicle.vehicleModel = faker.random.arrayElement(vehicleModels);
        return vehicle;
      })
      .createMany(SEEDED_VEHICLES_COUNT);
  }
}
