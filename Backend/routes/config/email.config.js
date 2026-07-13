// config/email.config.js
import nodemailer from 'nodemailer'

// Configuración del transporter (el que envía los correos)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Puede ser: gmail, outlook, yahoo, etc.
    auth: {
        user: process.env.EMAIL_USER,  // Tu correo
        pass: process.env.EMAIL_PASS   // Tu contraseña o contraseña de aplicación
    }
})

// Verificar que la configuración es correcta
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Error en configuración de email:', error)
    } else {
        console.log('✅ Servidor de correo listo para enviar emails')
    }
})

export default transporter