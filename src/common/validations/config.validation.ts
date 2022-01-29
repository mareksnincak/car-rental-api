import Joi from 'joi';

import { ELogLevel } from '../constants/logger.constants';

const validationSchema = {
  NODE_ENV: Joi.string()
    .valid('test', 'development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string()
    .valid(...Object.keys(ELogLevel))
    .default('log'),
  TYPEORM_HOST: Joi.string().default('localhost'),
  TYPEORM_PORT: Joi.number().default(5432),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string(),
  TYPEORM_LOGGING: Joi.boolean().default(false),
  TYPEORM_MIGRATIONS_RUN: Joi.boolean().default(false),
};

export default Joi.object(validationSchema);
