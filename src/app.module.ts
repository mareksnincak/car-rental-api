import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { VehicleModule } from '@vehicles/vehicle.module';
import configValidation from '@common/validations/config.validation';

const getDbConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [`${__dirname}/entities/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  synchronize: false,
  logging: configService.get('DB_LOGGING'),
  migrationsRun: configService.get('DB_AUTORUN_MIGRATIONS'),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => getDbConfig(configService),
      inject: [ConfigService],
    }),
    VehicleModule,
  ],
})
export class AppModule {}
