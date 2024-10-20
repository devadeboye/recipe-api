import * as Joi from 'joi';

export const addFavouriteValidator = Joi.number().greater(0).required();
