import { TSearchParams } from '@common/types/search.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from '@repositories/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async search(searchParams: TSearchParams) {
    const [vehicles, totalRecordCount] = await this.vehicleRepository.search(
      searchParams,
    );

    return {
      vehicles: vehicles.map((vehicle) => vehicle.toJson()),
      pagination: {
        page: searchParams.page,
        pageSize: searchParams.pageSize,
        totalRecordCount,
      },
    };
  }
}
