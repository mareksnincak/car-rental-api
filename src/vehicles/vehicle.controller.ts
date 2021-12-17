import { Controller, Get, Query } from '@nestjs/common';

import { VehicleService } from './vehicle.service';
import { SearchVehiclesDto } from './dtos/search.dto';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  async search(@Query() queryParams: SearchVehiclesDto) {
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
