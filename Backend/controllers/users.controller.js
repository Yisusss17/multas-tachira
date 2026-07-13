import { 
    GetUsers, GetUserById, CreateUser, UpdateUser, DeleteUser,
    UpdateUserProfileModule
} from "../modules/users.modules.js"
import { UserValidation, UserUpdateValidation } from "../validates/user.validation.js"
import bcrypt from "bcrypt"

export const GetAllUsers = async (req, res, next) => {
    try {
        const users = await GetUsers()
        req.message = { 
            type: "Successfully", 
            message: users, 
            status: 200 
        }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllUsers:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await GetUserById(id)
        
        if (!user) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        // No enviar la contraseña
        delete user.password
        
        req.message = { type: "Successfully", message: user, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetUser:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateNewUser = async (req, res, next) => {
    try {
        console.log("📥 Creando nuevo usuario:", req.body)
        
        const { error, value } = UserValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }

        const salt = await bcrypt.genSalt(10)
        value.password = await bcrypt.hash(value.password, salt)

        const newUser = await CreateUser(value)
        delete newUser.password
        
        req.message = { type: "Successfully", message: newUser, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewUser:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateExistingUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UserUpdateValidation.validate(req.body)

        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }

        // Si se envía password, encriptarla
        if (value.password && value.password.trim() !== '') {
            const salt = await bcrypt.genSalt(10)
            value.password = await bcrypt.hash(value.password, salt)
        } else {
            delete value.password
        }

        const updatedUser = await UpdateUser(id, value)
        
        if (!updatedUser) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        delete updatedUser.password
        
        req.message = { type: "Successfully", message: updatedUser, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingUser:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteExistingUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedUser = await DeleteUser(id)
        
        if (!deletedUser) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        req.message = { type: "Successfully", message: "Usuario eliminado correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingUser:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// PERFIL DE USUARIO (NUEVO)
// ============================================

// Obtener el perfil del usuario autenticado
export const GetUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await GetUserById(userId)
        
        if (!user) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        delete user.password
        
        req.message = { type: "Successfully", message: user, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetUserProfile:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// Actualizar el perfil del usuario autenticado
export const UpdateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { first_name, last_name, email, phone } = req.body

        // Validación básica
        if (!first_name || !last_name || !email) {
            req.message = { 
                type: "Validation", 
                message: "Nombre, apellido y correo son requeridos", 
                status: 400 
            }
            return next()
        }

        const updatedUser = await UpdateUserProfileModule(userId, { 
            first_name, 
            last_name, 
            email, 
            phone 
        })
        
        if (!updatedUser) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        
        delete updatedUser.password
        
        req.message = { type: "Successfully", message: updatedUser, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateUserProfile:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}