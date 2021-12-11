import Joi from 'joi';

const validationSchema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  TYPEORM_HOST: Joi.string().default('localhost'),
  TYPEORM_PORT: Joi.number().default(5432),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().default('car-sharing'),
  TYPEORM_LOGGING: Joi.boolean().default(true),
  TYPEORM_MIGRATIONS_RUN: Joi.boolean().default(true),
};

export default Joi.object(validationSchema);
