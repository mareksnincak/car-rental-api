import { Controller, Get, Query } from '@nestjs/common';

import { VehicleService } from './vehicle.service';
import { SearchVehiclesDto } from './dtos/search.dto';
import { User } from '@src/db/entities/user.entity';
import { Locals } from '@src/common/decorators/express/locals.decorator';

@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  async search(
    @Locals('user') user: User,
    @Query() queryParams: SearchVehiclesDto,
  ) {
    const { vehicles, pagination } = await this.vehicleService.search(
      user,
      queryParams,
    );

    return {
      data: vehicles,
      pagination,
    };
  }
}
