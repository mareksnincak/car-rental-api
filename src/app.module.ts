import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModule } from '@vehicles/vehicle.module';
import configValidation from '@common/validations/config.validation';
import ormConfig from '@db/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRoot(ormConfig),
    VehicleModule,
  ],
})
export class AppModule {}
