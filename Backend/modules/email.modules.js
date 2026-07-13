// modules/email.modules.js
import transporter from '../config/email.config.js'

/**
 * Enviar correo con nueva contraseña
 * @param {string} email - Correo del usuario
 * @param {string} newPassword - Nueva contraseña generada
 * @param {string} name - Nombre del usuario
 */
export const sendPasswordRecoveryEmail = async (email, newPassword, name) => {
    const mailOptions = {
        from: `"Sistema de Multas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Recuperación de Contraseña - Sistema de Multas',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                <h1 style="color: #0d6efd; text-align: center;">Recuperación de Contraseña</h1>
                
                <p>Hola <strong>${name}</strong>,</p>
                
                <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #6c757d;">Tu nueva contraseña es:</p>
                    <h2 style="margin: 10px 0; color: #0d6efd; text-align: center; letter-spacing: 2px;">${newPassword}</h2>
                </div>
                
                <p style="color: #dc3545; font-size: 14px;">
                    ⚠️ <strong>Importante:</strong> Te recomendamos cambiar esta contraseña después de iniciar sesión.
                </p>
                
                <hr style="margin: 20px 0;">
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Este es un mensaje automático, por favor no responder.<br>
                    Si no solicitaste este cambio, ignora este mensaje.
                </p>
            </div>
        `
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('✅ Email de recuperación enviado a:', email)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('❌ Error enviando email:', error)
        return { success: false, error: error.message }
    }
}