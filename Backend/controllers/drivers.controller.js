import { 
    GetDrivers, GetDriverById, GetDriverByIdentification,
    CreateDriver, UpdateDriver, DeleteDriver
} from "../modules/drivers.modules.js"
import { DriverValidation } from "../validates/driver.validation.js"

// Obtener todos los conductores
export const GetAllDrivers = async (req, res, next) => {
    try {
        const drivers = await GetDrivers()
        req.message = { type: "Successfully", message: drivers, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllDrivers:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener conductor por ID
export const GetDriver = async (req, res, next) => {
    try {
        const { id } = req.params
        const driver = await GetDriverById(id)
        
        if (!driver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: driver, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetDriver:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener conductor por cédula (identificación)
export const GetDriverByIdentificationCtrl = async (req, res, next) => {
    try {
        const { identification } = req.params
        const driver = await GetDriverByIdentification(identification)
        
        if (!driver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: driver, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetDriverByIdentificationCtrl:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Crear nuevo conductor
export const CreateNewDriver = async (req, res, next) => {
    try {
        console.log("📥 Creando nuevo conductor:", req.body)
        
        const { error, value } = DriverValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar si ya existe un conductor con esa cédula
        const existing = await GetDriverByIdentification(value.identification)
        if (existing) {
            req.message = { type: "Validation", message: "Ya existe un conductor con esa cédula", status: 400 }
            return next()
        }
        
        const newDriver = await CreateDriver(value)
        req.message = { type: "Successfully", message: newDriver, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewDriver:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Actualizar conductor
export const UpdateExistingDriver = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = DriverValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        const updatedDriver = await UpdateDriver(id, value)
        
        if (!updatedDriver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: updatedDriver, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingDriver:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Eliminar conductor
export const DeleteExistingDriver = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedDriver = await DeleteDriver(id)
        
        if (!deletedDriver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: "Conductor eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingDriver:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}