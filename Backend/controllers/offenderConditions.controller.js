import { 
    GetOffenderConditions, GetOffenderConditionById, GetOffenderConditionByName,
    CreateOffenderCondition, UpdateOffenderCondition, DeleteOffenderCondition
} from "../modules/offenderConditions.modules.js"
import Joi from "joi"

const OffenderConditionValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional()
})

export const GetAllOffenderConditions = async (req, res, next) => {
    try {
        const conditions = await GetOffenderConditions()
        req.message = { type: "Successfully", message: conditions, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetOffenderCondition = async (req, res, next) => {
    try {
        const { id } = req.params
        const condition = await GetOffenderConditionById(id)
        if (!condition) {
            req.message = { type: "Not Found", message: "Condición no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: condition, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateNewOffenderCondition = async (req, res, next) => {
    try {
        const { error, value } = OffenderConditionValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar si ya existe
        const existing = await GetOffenderConditionByName(value.name)
        if (existing) {
            req.message = { type: "Validation", message: "Ya existe una condición con ese nombre", status: 400 }
            return next()
        }
        
        const newCondition = await CreateOffenderCondition(value)
        req.message = { type: "Successfully", message: newCondition, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateExistingOffenderCondition = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = OffenderConditionValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const updated = await UpdateOffenderCondition(id, value)
        if (!updated) {
            req.message = { type: "Not Found", message: "Condición no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: updated, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteExistingOffenderCondition = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await DeleteOffenderCondition(id)
        if (!deleted) {
            req.message = { type: "Not Found", message: "Condición no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: "Condición eliminada correctamente", status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}