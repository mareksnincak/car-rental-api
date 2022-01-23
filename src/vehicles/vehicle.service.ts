import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VehicleRepository } from '@repositories/vehicle.repository';
import { TCalculatePriceParams, TSearchParams } from './vehicle.type';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
  ) {}

  async search(searchParams: TSearchParams & { driverAge?: number }) {
    const { fromDate, toDate, driverAge, page, pageSize } = searchParams;

    const [vehicles, totalRecordCount] = await this.vehicleRepository.search(
      searchParams,
    );

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

  async getDetail({
    id,
    fromDate,
    toDate,
    driverAge,
  }: Partial<TCalculatePriceParams> & { id: string }) {
    const vehicle = await this.vehicleRepository.getOneWithFutureBookingsOrFail(
      id,
    );

    return {
      vehicle: vehicle.toJson({ fromDate, toDate, driverAge }),
      bookings: vehicle.bookings.map((booking) => booking.toJson()),
    };
  }

  async getPrice({
    id,
    fromDate,
    toDate,
    driverAge,
  }: TCalculatePriceParams & { id: string }) {
    const vehicle = await this.vehicleRepository.getOneOrFail({
      where: {
        id,
      },
    });

    return vehicle.calculatePrice({ fromDate, toDate, driverAge });
  }
}
