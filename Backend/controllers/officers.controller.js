import { 
    GetOfficers, GetOfficerById, GetOfficerByUserId, GetOfficerByBadgeCode,
    CreateOfficer, UpdateOfficer, UpdateOfficerStatus, DeleteOfficer, GetOfficersStats
} from "../modules/officers.modules.js"
import { GetUserById } from "../modules/users.modules.js"
import { OfficerValidation, OfficerStatusValidation } from "../validates/officer.validation.js"

// Obtener todos los oficiales
export const GetAllOfficers = async (req, res, next) => {
    try {
        const officers = await GetOfficers()
        req.message = { type: "Successfully", message: officers, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllOfficers:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener oficial por ID
export const GetOfficer = async (req, res, next) => {
    try {
        const { id } = req.params
        const officer = await GetOfficerById(id)
        
        if (!officer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: officer, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetOfficer:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener oficial por ID de usuario
export const GetOfficerByUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const officer = await GetOfficerByUserId(userId)
        
        if (!officer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado para este usuario", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: officer, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetOfficerByUser:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener oficial por código de placa
export const GetOfficerByBadge = async (req, res, next) => {
    try {
        const { badgeCode } = req.params
        const officer = await GetOfficerByBadgeCode(badgeCode)
        
        if (!officer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: officer, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetOfficerByBadge:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Crear nuevo oficial
export const CreateNewOfficer = async (req, res, next) => {
    try {
        console.log("📥 Creando nuevo oficial:", req.body)
        
        const { error, value } = OfficerValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar que el usuario existe
        const user = await GetUserById(value.id_user)
        if (!user) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        // Verificar que el usuario no tenga ya un oficial asignado
        const existingOfficer = await GetOfficerByUserId(value.id_user)
        if (existingOfficer) {
            req.message = { type: "Validation", message: "Este usuario ya tiene un oficial asociado", status: 400 }
            return next()
        }
        
        // Verificar que el código de placa no exista
        const existingBadge = await GetOfficerByBadgeCode(value.badge_code)
        if (existingBadge) {
            req.message = { type: "Validation", message: "El código de placa ya está en uso", status: 400 }
            return next()
        }
        
        const newOfficer = await CreateOfficer(value)
        req.message = { type: "Successfully", message: newOfficer, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewOfficer:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Actualizar oficial
export const UpdateExistingOfficer = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = OfficerValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar que el oficial existe
        const existingOfficer = await GetOfficerById(id)
        if (!existingOfficer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        // Si cambia badge_code, verificar que no exista otro con ese código
        if (value.badge_code !== existingOfficer.badge_code) {
            const badgeExists = await GetOfficerByBadgeCode(value.badge_code)
            if (badgeExists && badgeExists.id_officer !== id) {
                req.message = { type: "Validation", message: "El código de placa ya está en uso", status: 400 }
                return next()
            }
        }
        
        const updatedOfficer = await UpdateOfficer(id, value)
        req.message = { type: "Successfully", message: updatedOfficer, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingOfficer:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Actualizar estado del oficial
export const UpdateOfficerStatusCtrl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = OfficerStatusValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        const updatedOfficer = await UpdateOfficerStatus(id, value.status)
        
        if (!updatedOfficer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: updatedOfficer, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateOfficerStatus:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Eliminar oficial
export const DeleteExistingOfficer = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedOfficer = await DeleteOfficer(id)
        
        if (!deletedOfficer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: "Oficial eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingOfficer:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Estadísticas de oficiales
export const GetOfficersStatistics = async (req, res, next) => {
    try {
        const stats = await GetOfficersStats()
        req.message = { type: "Successfully", message: stats, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetOfficersStatistics:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}