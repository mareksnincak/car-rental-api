import Joi from 'joi';

const validationSchema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().default('car-sharing'),
  DB_LOGGING: Joi.string().default(true),
  DB_AUTORUN_MIGRATIONS: Joi.string().default(true),
};

export default Joi.object(validationSchema);
