import { 
    GetVehicles, GetVehicleById, GetVehicleByPlate, GetVehiclesByDriver,
    CreateVehicle, UpdateVehicle, DeleteVehicle
} from "../modules/vehicles.modules.js"
import { VehicleValidation } from "../validates/vehicle.validation.js"
import { GetDriverById } from "../modules/drivers.modules.js"

export const GetAllVehicles = async (req, res, next) => {
    try {
        const vehicles = await GetVehicles()
        req.message = { type: "Successfully", message: vehicles, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllVehicles:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const vehicle = await GetVehicleById(id)
        
        if (!vehicle) {
            req.message = { type: "Not Found", message: "Vehículo no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: vehicle, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetVehicle:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetVehicleByPlateCtrl = async (req, res, next) => {
    try {
        const { plate } = req.params
        const vehicle = await GetVehicleByPlate(plate)
        
        if (!vehicle) {
            req.message = { type: "Not Found", message: "Vehículo no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: vehicle, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetVehicleByPlate:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetVehiclesByDriverCtrl = async (req, res, next) => {
    try {
        const { driverId } = req.params
        
        // Verificar que el conductor existe
        const driver = await GetDriverById(driverId)
        if (!driver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        const vehicles = await GetVehiclesByDriver(driverId)
        req.message = { type: "Successfully", message: vehicles, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetVehiclesByDriver:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateNewVehicle = async (req, res, next) => {
    try {
        console.log("📥 Creando nuevo vehículo:", req.body)
        
        const { error, value } = VehicleValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar si la placa ya existe
        const existing = await GetVehicleByPlate(value.plate)
        if (existing) {
            req.message = { type: "Validation", message: "Ya existe un vehículo con esa placa", status: 400 }
            return next()
        }
        
        // Verificar que el conductor existe (si se proporcionó)
        if (value.id_driver) {
            const driver = await GetDriverById(value.id_driver)
            if (!driver) {
                req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
                return next()
            }
        }
        
        const newVehicle = await CreateVehicle(value)
        req.message = { type: "Successfully", message: newVehicle, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewVehicle:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateExistingVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = VehicleValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        const updatedVehicle = await UpdateVehicle(id, value)
        
        if (!updatedVehicle) {
            req.message = { type: "Not Found", message: "Vehículo no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: updatedVehicle, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingVehicle:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteExistingVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedVehicle = await DeleteVehicle(id)
        
        if (!deletedVehicle) {
            req.message = { type: "Not Found", message: "Vehículo no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: "Vehículo eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingVehicle:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}