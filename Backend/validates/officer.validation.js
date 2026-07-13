import Joi from "joi"

export const OfficerValidation = Joi.object({
    status: Joi.string().valid('Active', 'Inactive').default('Active'),
    badge_code: Joi.string().max(15).required(),
    id_user: Joi.number().integer().required()
})

export const OfficerStatusValidation = Joi.object({
    status: Joi.string().valid('Active', 'Inactive').required()
})