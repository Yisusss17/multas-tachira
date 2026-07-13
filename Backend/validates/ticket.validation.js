import Joi from "joi"

export const TicketValidation = Joi.object({
    ticket_number: Joi.string().max(20).required(),
    id_officer: Joi.number().integer().required(),
    id_driver: Joi.number().integer().required(),
    id_vehicle: Joi.number().integer().required(),
    id_condition: Joi.number().integer().required(),
    location: Joi.string().required(),
    issue_timestamp: Joi.date().optional(),
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').default('Pending'),
    observations: Joi.string().allow('', null).optional(),
    ut_daily_value_bs: Joi.number().positive().precision(2).required(),
    total_ut: Joi.number().precision(2).default(0)
})

export const TicketStatusValidation = Joi.object({
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').required()
})