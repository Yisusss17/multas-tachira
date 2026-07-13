import Joi from "joi"

export const DriverValidation = Joi.object({
    identification: Joi.string().max(15).required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    address: Joi.string().allow('', null).optional(),
    phone: Joi.string().max(20).allow('', null).optional(),
    email: Joi.string().email({ tlds: { allow: false } }).max(100).allow('', null).optional(),
    birth_date: Joi.date().optional(),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
})