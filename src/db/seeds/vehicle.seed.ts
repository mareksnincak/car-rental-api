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
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/astra_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/aygo_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/captur_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/clio_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/fabia_estate_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/fabia_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/octavia_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/tipo_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/xc60_lrg.jpg',
  'https://s3.eu-central-1.amazonaws.com/marek-snincak.car-sharing/xf_lrg.jpg',
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
