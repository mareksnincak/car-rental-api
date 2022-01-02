import { Controller, Get, Param, Query } from '@nestjs/common';

import { VehicleService } from './vehicle.service';
import { SearchVehiclesDto } from './dtos/search.dto';
import { GetByIdDto } from '@common/dtos/get-by-id.dto';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  async search(@Query() queryParams: SearchVehiclesDto) {
    const { vehicles, pagination } = await this.vehicleService.search(
      queryParams,
    );

    return {
      vehicles,
      pagination,
    };
  }

  @Get('/:id')
  async getDetail(@Param() params: GetByIdDto) {
    const { id } = params;

    const { vehicle, bookings } = await this.vehicleService.getDetail(id);

    return { vehicle, bookings };
  }
}
