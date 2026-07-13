// Backend/validates/infraction.validation.js
import Joi from "joi";

export const InfractionValidation = Joi.object({
    violation_description: Joi.string().required(),
    ut_quantity: Joi.number().positive().precision(2).required()  // ← Nota: ut_quantity, no ut_cost
});