import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleRepository } from '@db/repositories/vehicle.repository';
import { BookingRepository } from '@repositories/booking.repository';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingRepository]),
    TypeOrmModule.forFeature([VehicleRepository]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
