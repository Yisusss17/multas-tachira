// controllers/password.controller.js
import { GetUserByEmail, UpdateUserPassword, GetUserById } from "../modules/users.modules.js"
import { sendPasswordRecoveryEmail } from "../modules/email.modules.js"
import bcrypt from "bcrypt"
import Joi from "joi"

// Validación para la solicitud de recuperación
const RecoveryValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required()
})

// ============================================
// FUNCIÓN PARA GENERAR CONTRASEÑA ALEATORIA
// ============================================
const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
}

// ============================================
// RECUPERAR CONTRASEÑA (PÚBLICO)
// ============================================
export const recoverPassword = async (req, res, next) => {
    try {
        console.log("📥 Solicitud de recuperación de contraseña")
        console.log("📧 Email recibido:", req.body.email)
        
        // 1. Validar que el email sea correcto
        const { error, value } = RecoveryValidation.validate(req.body)
        
        if (error) {
            console.log("❌ Email inválido:", error.details)
            req.message = { 
                type: "Validation", 
                message: "El formato del email no es válido", 
                status: 400 
            }
            return next()
        }
        
        // 2. Buscar el usuario por email
        const user = await GetUserByEmail(value.email)
        
        // 3. Si NO existe, devolver mensaje (sin revelar información sensible)
        if (!user) {
            console.log("⚠️ Email no encontrado, pero no revelamos información")
            req.message = { 
                type: "Successfully", 
                message: "Si el email existe en el sistema, recibirás un correo con tu nueva contraseña", 
                status: 200 
            }
            return next()
        }
        
        console.log("✅ Usuario encontrado:", user.email)
        
        // 4. Generar nueva contraseña aleatoria
        const newPassword = generateRandomPassword()
        console.log("🔑 Nueva contraseña generada:", newPassword)
        
        // 5. Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        console.log("🔐 Contraseña encriptada")
        
        // 6. Actualizar la contraseña en la base de datos
        const updatedUser = await UpdateUserPassword(user.id_user, hashedPassword)
        
        if (!updatedUser) {
            req.message = { 
                type: "Error", 
                message: "Error al actualizar la contraseña", 
                status: 500 
            }
            return next()
        }
        
        console.log("✅ Contraseña actualizada en la base de datos")
        
        // 7. Enviar correo con la nueva contraseña
        const emailResult = await sendPasswordRecoveryEmail(
            user.email, 
            newPassword, 
            `${user.first_name} ${user.last_name}`
        )
        
        if (!emailResult.success) {
            console.log("⚠️ El correo no se pudo enviar, pero la contraseña fue actualizada")
        }
        
        // 8. Devolver respuesta (siempre positiva, sin revelar si el email existe)
        req.message = { 
            type: "Successfully", 
            message: "Si el email existe en el sistema, recibirás un correo con tu nueva contraseña", 
            status: 200 
        }
        return next()
        
    } catch (err) {
        console.error("❌ Error en recoverPassword:", err)
        req.message = { 
            type: "Error", 
            message: "Error interno del servidor", 
            status: 500 
        }
        return next()
    }
}

// ============================================
// CAMBIAR CONTRASEÑA (PROTEGIDO - PARA USUARIO AUTENTICADO)
// ============================================
export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id // viene del token (verifyToken)
        const { currentPassword, newPassword } = req.body

        // Validar campos
        if (!currentPassword || !newPassword) {
            req.message = { 
                type: "Validation", 
                message: "Todos los campos son requeridos", 
                status: 400 
            }
            return next()
        }

        if (newPassword.length < 6) {
            req.message = { 
                type: "Validation", 
                message: "La nueva contraseña debe tener al menos 6 caracteres", 
                status: 400 
            }
            return next()
        }

        // Obtener el usuario de la base de datos
        const user = await GetUserById(userId)
        if (!user) {
            req.message = { 
                type: "Not Found", 
                message: "Usuario no encontrado", 
                status: 404 
            }
            return next()
        }

        // Verificar que la contraseña actual sea correcta
        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) {
            req.message = { 
                type: "Validation", 
                message: "Contraseña actual incorrecta", 
                status: 400 
            }
            return next()
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Actualizar en la base de datos
        await UpdateUserPassword(userId, hashedPassword)

        req.message = { 
            type: "Successfully", 
            message: "Contraseña actualizada correctamente", 
            status: 200 
        }
        return next()

    } catch (err) {
        console.error("❌ Error en changePassword:", err)
        req.message = { 
            type: "Error", 
            message: err.message, 
            status: 500 
        }
        return next()
    }
}