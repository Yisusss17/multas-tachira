import { 
    GetRoles, GetRoleById, GetRoleByName, 
    CreateRole, UpdateRole, DeleteRole 
} from "../modules/roles.modules.js"
import Joi from "joi"

// Validación para roles
const RoleValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional()
})

// Obtener todos los roles
export const GetAllRoles = async (req, res, next) => {
    try {
        const roles = await GetRoles()
        req.message = { type: "Successfully", message: roles, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllRoles:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener un rol por ID
export const GetRole = async (req, res, next) => {
    try {
        const { id } = req.params
        const role = await GetRoleById(id)
        
        if (!role) {
            req.message = { type: "Not Found", message: "Rol no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: role, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetRole:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Obtener un rol por nombre
export const GetRoleByNameController = async (req, res, next) => {
    try {
        const { name } = req.params
        const role = await GetRoleByName(name)
        
        if (!role) {
            req.message = { type: "Not Found", message: "Rol no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: role, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetRoleByNameController:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Crear un nuevo rol
export const CreateNewRole = async (req, res, next) => {
    try {
        console.log("📥 Creando nuevo rol:", req.body)
        
        const { error, value } = RoleValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar si ya existe un rol con ese nombre
        const existing = await GetRoleByName(value.name)
        if (existing) {
            req.message = { type: "Validation", message: "Ya existe un rol con ese nombre", status: 400 }
            return next()
        }
        
        const newRole = await CreateRole(value)
        req.message = { type: "Successfully", message: newRole, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewRole:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Actualizar un rol
export const UpdateExistingRole = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = RoleValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        // Verificar si el rol existe
        const existingRole = await GetRoleById(id)
        if (!existingRole) {
            req.message = { type: "Not Found", message: "Rol no encontrado", status: 404 }
            return next()
        }
        
        // Si cambia el nombre, verificar que no exista otro con ese nombre
        if (value.name !== existingRole.name) {
            const nameExists = await GetRoleByName(value.name)
            if (nameExists) {
                req.message = { type: "Validation", message: "Ya existe otro rol con ese nombre", status: 400 }
                return next()
            }
        }
        
        const updatedRole = await UpdateRole(id, value)
        req.message = { type: "Successfully", message: updatedRole, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingRole:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Eliminar un rol
export const DeleteExistingRole = async (req, res, next) => {
    try {
        const { id } = req.params
        
        // Verificar si el rol existe
        const existingRole = await GetRoleById(id)
        if (!existingRole) {
            req.message = { type: "Not Found", message: "Rol no encontrado", status: 404 }
            return next()
        }
        
        const deletedRole = await DeleteRole(id)
        req.message = { type: "Successfully", message: "Rol eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingRole:", err)
        
        // Si el rol está siendo usado por usuarios
        if (err.code === '23503') {
            req.message = { 
                type: "Error", 
                message: "No se puede eliminar el rol porque tiene usuarios asociados", 
                status: 400 
            }
            return next()
        }
        
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}