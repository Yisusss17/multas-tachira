import {
    GetInfractions,
    GetInfractionById,
    CreateInfraction,
    UpdateInfraction,
    DeleteInfraction
} from "../modules/infractions.modules.js"
import Joi from "joi"

// ============================================
// VALIDACIÓN PARA INFRACCIONES
// ============================================
const InfractionValidation = Joi.object({
    violation_description: Joi.string().max(200).required(),
    ut_quantity: Joi.number().positive().precision(2).required()  // ← Cambiado de ut_cost a ut_quantity
})

// ============================================
// OBTENER TODAS LAS INFRACCIONES
// ============================================
export const GetAllInfractions = async (req, res, next) => {
    try {
        const infractions = await GetInfractions()
        req.message = {
            type: "Successfully",
            message: infractions,
            status: 200
        }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllInfractions:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// OBTENER UNA INFRACCIÓN POR ID
// ============================================
export const GetInfraction = async (req, res, next) => {
    try {
        const { id } = req.params
        const infraction = await GetInfractionById(id)

        if (!infraction) {
            req.message = {
                type: "Not Found",
                message: "Infracción no encontrada",
                status: 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: infraction,
            status: 200
        }
        return next()
    } catch (err) {
        console.error("❌ Error en GetInfraction:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// CREAR NUEVA INFRACCIÓN
// ============================================
export const CreateNewInfraction = async (req, res, next) => {
    try {
        console.log("📥 Creando nueva infracción:", req.body)

        // Validar datos
        const { error, value } = InfractionValidation.validate(req.body)

        if (error) {
            console.log("❌ Error de validación:", error.details)
            req.message = {
                type: "Validation",
                message: error.details,
                status: 400
            }
            return next()
        }

        const newInfraction = await CreateInfraction(value)

        req.message = {
            type: "Successfully",
            message: newInfraction,
            status: 201
        }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewInfraction:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// ACTUALIZAR INFRACCIÓN
// ============================================
export const UpdateExistingInfraction = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(`📥 Actualizando infracción ID: ${id}`, req.body)

        // Validar datos
        const { error, value } = InfractionValidation.validate(req.body)

        if (error) {
            console.log("❌ Error de validación:", error.details)
            req.message = {
                type: "Validation",
                message: error.details,
                status: 400
            }
            return next()
        }

        const updatedInfraction = await UpdateInfraction(id, value)

        if (!updatedInfraction) {
            req.message = {
                type: "Not Found",
                message: "Infracción no encontrada",
                status: 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: updatedInfraction,
            status: 200
        }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingInfraction:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// ELIMINAR INFRACCIÓN
// ============================================
export const DeleteExistingInfraction = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(`📥 Eliminando infracción ID: ${id}`)

        const deletedInfraction = await DeleteInfraction(id)

        if (!deletedInfraction) {
            req.message = {
                type: "Not Found",
                message: "Infracción no encontrada",
                status: 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: "Infracción eliminada correctamente",
            status: 200
        }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingInfraction:", err)

        // Verificar si el error es por llave foránea
        if (err.code === '23503') {
            req.message = {
                type: "Error",
                message: "No se puede eliminar la infracción porque está siendo utilizada en multas",
                status: 400
            }
            return next()
        }

        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}