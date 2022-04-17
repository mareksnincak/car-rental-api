import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@repositories/vehicle.repository';
import { User } from '@src/db/entities/user.entity';
import { TSearchParams } from './vehicle.type';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async search(user: User, searchParams: TSearchParams) {
    const { toDate, page, pageSize } = searchParams;

    const fromDate = new Date();
    const driverAge = user.getAge(fromDate);

    const [vehicles, totalRecordCount] = await this.vehicleRepository.search({
      ...searchParams,
      fromDate,
    });

    return {
      vehicles: vehicles.map((vehicle) =>
        vehicle.toJson({ fromDate, toDate, driverAge }),
      ),
      pagination: {
        page,
        pageSize,
        totalRecordCount,
      },
    };
  }
}
