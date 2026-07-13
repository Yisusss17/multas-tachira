import Joi from "joi";

export const LoginValidated = Joi.object({

    email: Joi.string()
        .email({ tlds: false })
        .required(),

    password: Joi.string()
        .required()

});