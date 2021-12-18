import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleRepository } from '@repositories/vehicle.repository';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleRepository])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
