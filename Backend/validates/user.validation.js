import Joi from "joi"

// Validación para CREAR usuario (password obligatorio)
export const UserValidation = Joi.object({
    identification: Joi.string().max(15).required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
    password: Joi.string().min(6).max(60).required(),
    
    id_rol: Joi.number().integer().required(),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
})

// Validación para ACTUALIZAR usuario (password opcional)
export const UserUpdateValidation = Joi.object({
    identification: Joi.string().max(15).required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
    password: Joi.string().min(6).max(60).allow('', null).optional(),
  
    id_rol: Joi.number().integer().required(),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
})