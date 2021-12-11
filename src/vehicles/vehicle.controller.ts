import { Controller, Get, Query } from '@nestjs/common';
import { TPagination } from '@common/types/pagination.type';
import { VehicleService } from '@vehicles/vehicle.service';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  search(@Query() queryParams: TPagination & { query: string }) {
    const { page, pageSize } = queryParams;

    const { vehicles, totalRecordCount } = this.vehicleService.search();

    return {
      vehicles,
      pagination: {
        page,
        pageSize,
        totalRecordCount,
      },
    };
  }
}
