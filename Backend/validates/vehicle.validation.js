import Joi from "joi"

export const VehicleValidation = Joi.object({
    plate: Joi.string().max(10).required(),
    id_driver: Joi.number().integer().allow(null).optional(),
    id_vehicle_type: Joi.number().integer().required(),
    brand: Joi.string().max(50).allow('', null).optional(),
    model: Joi.string().max(50).allow('', null).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    color: Joi.string().max(30).allow('', null).optional(),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
})