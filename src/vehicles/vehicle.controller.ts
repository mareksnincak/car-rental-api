import { Controller, Get, Query } from '@nestjs/common';
import { TPagination } from '@common/types/pagination.type';
import { VehicleService } from '@vehicles/vehicle.service';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  async search(@Query() queryParams: TPagination & { query: string }) {
    const { page, pageSize, sortBy, sortDirection, query } = queryParams;

    const { vehicles, pagination } = await this.vehicleService.search({
      page,
      pageSize,
      sortBy,
      sortDirection,
      query,
    });

    return {
      vehicles,
      pagination,
    };
  }
}
