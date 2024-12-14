import * as Joi from 'joi';

const passwordValidator = Joi.string()
  .trim()
  .min(8)
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  .required()
  .messages({
    'string.base': `"password" should be a type of 'text'`,
    'any.required': `"password" is a required`,
    'string.pattern.base':
      'Password must be minimum of 8 characters, contain an uppercase letter, a number and a special character',
  });

export const signupValidator = Joi.object({
  username: Joi.string().required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'any.required': `"name" is a required field`,
  }),
  password: passwordValidator,
});

export const loginValidator = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'any.required': `"name" is a required field`,
  }),
  password: passwordValidator,
});

export const userSearchValidator = Joi.object({
  limit: Joi.number().default(1),
  page: Joi.number().default(1),
  id: Joi.array().items(Joi.string()).allow(null),
  username: Joi.array().items(Joi.string()),
});

export const refreshTokenRequestValidator = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': `"refreshToken" should be a type of 'text'`,
    'any.required': `"refreshToken" is a required field`,
  }),
});
