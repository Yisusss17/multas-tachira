// generate-hash.js
import bcrypt from 'bcrypt'

async function generateHash() {
    try {
        // 🔐 La contraseña que quieres usar (ej: "password123")
        const password = 'password123'
        
        console.log('🔑 Generando hash para la contraseña:', password)
        console.log('----------------------------------------')
        
        // 1. Generar un "salt" (una semilla aleatoria para encriptar)
        const salt = await bcrypt.genSalt(10)
        console.log('🧂 Salt generado:', salt)
        
        // 2. Generar el hash (encriptar la contraseña con el salt)
        const hash = await bcrypt.hash(password, salt)
        console.log('🔒 Hash generado:', hash)
        console.log('📏 Longitud del hash:', hash.length, 'caracteres')
        
        console.log('----------------------------------------')
        console.log('✅ COPIA ESTE HASH PARA USARLO EN LA BD:')
        console.log(hash)
        
    } catch (error) {
        console.error('❌ Error al generar el hash:', error)
    }
}

// Ejecutar la función
generateHash()