import { ConnectionOptions } from 'typeorm-seeding';

/**
 * We are accessing env variables directly and not using config service
 * to be able to use it as cli config as well
 */
const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [`${__dirname}/src/db/entities/*.entity.{ts,js}`],
  migrations:
    process.env.NODE_ENV === 'test'
      ? [`${__dirname}/test/db/migrations/*.{ts,js}`]
      : [`${__dirname}/src/db/migrations/*.{ts,js}`],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  seeds: [`${__dirname}/src/db/seeds/*{.ts,.js}`],
  factories: [`${__dirname}/src/db/factories/*{.ts,.js}`],
};

export default ormConfig;
