import bcrypt from 'bcrypt'

// El hash de la contraseña "password123" que tienes en tu BD
const hash = '$2b$10$Mv9gXvThR3V7bFEiYgK6uOnvWv7G9r2mGBlEbeW8H.V2gFSV9Z7Eq'
const password = 'password123'

console.log('🔍 Verificando contraseña...')
console.log('Contraseña ingresada:', password)
console.log('Hash en la BD:', hash)
console.log('Longitud del hash:', hash.length)

bcrypt.compare(password, hash, (err, result) => {
    if (err) {
        console.error('❌ Error:', err)
    } else {
        console.log('✅ ¿Coinciden?', result)
    }
})