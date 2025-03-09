import Joi from 'joi';

export const addProductIntoCartSchema = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().optional(),
});


export const deleteProductFromCartSchema = Joi.object({
    product_id: Joi.string().required(),
});