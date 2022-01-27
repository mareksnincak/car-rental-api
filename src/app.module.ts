import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configValidation from '@common/validations/config.validation';
import { VehicleModule } from '@vehicles/vehicle.module';
import { BookingModule } from '@bookings/booking.module';
import ormConfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRoot(ormConfig),
    VehicleModule,
    BookingModule,
  ],
})
export class AppModule {}
