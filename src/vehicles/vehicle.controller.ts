import { Controller, Get, Param, Query } from '@nestjs/common';

import { VehicleService } from './vehicle.service';
import { SearchVehiclesDto } from './dtos/search.dto';
import { GetPriceDto } from './dtos/get-price.dto';
import { GetDetailDto } from './dtos/get-detail.dto';
import { IdDto } from '@src/common/dtos/id.dto';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  async search(@Query() queryParams: SearchVehiclesDto) {
    const { vehicles, pagination } = await this.vehicleService.search(
      queryParams,
    );

    return {
      data: vehicles,
      pagination,
    };
  }

  @Get('/:id')
  async getDetail(@Param() params: IdDto, @Query() query: GetDetailDto) {
    const { id } = params;
    const { fromDate, toDate, driverAge } = query;

    const { vehicle, bookings } = await this.vehicleService.getDetail({
      id,
      fromDate,
      toDate,
      driverAge,
    });

    return { vehicle, bookings };
  }

  @Get('/price/:id')
  async getPrice(@Param() params: IdDto, @Query() query: GetPriceDto) {
    const { id } = params;
    const { fromDate, toDate, driverAge } = query;

    const price = await this.vehicleService.getPrice({
      id,
      fromDate,
      toDate,
      driverAge,
    });

    return price;
  }
}
