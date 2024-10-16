import * as Joi from 'joi';
import { EnvConfiguration } from '../enums/env.configuration';

// define validation for all env variables
export const envValidationSchema = Joi.object({
  [EnvConfiguration.NODE_ENV]: Joi.string()
    .trim()
    .valid('development', 'production', 'staging')
    .required(),
  [EnvConfiguration.CONNECTION_STRING]: Joi.string().trim().required(),
  [EnvConfiguration.PORT]: Joi.number(),
  [EnvConfiguration.JWT_LIFESPAN]: Joi.string().trim().required(),
  [EnvConfiguration.TOKEN_SECRET]: Joi.string().trim().required(),
  [EnvConfiguration.SPOONACULAR_BASE_URL]: Joi.string().trim().required(),
});
