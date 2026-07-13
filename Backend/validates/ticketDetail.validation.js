import Joi from "joi"

export const TicketDetailValidation = Joi.object({
    id_ticket: Joi.number()
        .integer()
        .required(),

    infraction_id: Joi.number()
        .integer()
        .required()
})