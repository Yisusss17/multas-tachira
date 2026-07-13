import { 
    GetVehicleTypes, GetVehicleTypeById, 
    CreateVehicleType, UpdateVehicleType, DeleteVehicleType
} from "../modules/vehicleTypes.modules.js"
import Joi from "joi"

const VehicleTypeValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional()
})

export const GetAllVehicleTypes = async (req, res, next) => {
    try {
        const types = await GetVehicleTypes()
        req.message = { type: "Successfully", message: types, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetVehicleType = async (req, res, next) => {
    try {
        const { id } = req.params
        const type = await GetVehicleTypeById(id)
        if (!type) {
            req.message = { type: "Not Found", message: "Tipo de vehículo no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: type, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateNewVehicleType = async (req, res, next) => {
    try {
        const { error, value } = VehicleTypeValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const newType = await CreateVehicleType(value)
        req.message = { type: "Successfully", message: newType, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateExistingVehicleType = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = VehicleTypeValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const updated = await UpdateVehicleType(id, value)
        if (!updated) {
            req.message = { type: "Not Found", message: "Tipo de vehículo no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: updated, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteExistingVehicleType = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await DeleteVehicleType(id)
        if (!deleted) {
            req.message = { type: "Not Found", message: "Tipo de vehículo no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: "Tipo de vehículo eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}