import bcrypt from 'bcrypt';
import database from './database.js'; // Ajusta la ruta según tu estructura

const hashearContraseñas = async () => {
    console.log('🔐 Iniciando hasheo de contraseñas...');

    try {
        // 1. Obtener todos los usuarios
        const { rows: usuarios } = await database.query(
            'SELECT id_user, password FROM users'
        );

        console.log(`📋 Encontrados ${usuarios.length} usuarios`);

        // 2. Recorrer cada usuario
        for (const usuario of usuarios) {
            const { id_user, password } = usuario;

            // 3. Verificar si la contraseña ya está hasheada
            // bcrypt hashes empiezan con '$2b$', '$2a$', '$2y$', etc.
            const yaHasheada = password.startsWith('$2') || password.startsWith('$2a') || password.startsWith('$2b') || password.startsWith('$2y');

            if (yaHasheada) {
                console.log(`✅ Usuario ${id_user} ya tiene contraseña hasheada, saltando...`);
                continue;
            }

            // 4. Hashear la contraseña
            const saltRounds = 10; // Nivel de seguridad (10 es estándar)
            const hash = await bcrypt.hash(password, saltRounds);

            // 5. Actualizar en la base de datos
            await database.query(
                'UPDATE users SET password = $1 WHERE id_user = $2',
                [hash, id_user]
            );

            console.log(`✅ Usuario ${id_user}: contraseña hasheada correctamente`);
        }

        console.log('🎉 ¡Todas las contraseñas hasheadas exitosamente!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        // Cerrar conexión a la base de datos
        await database.end();
    }
};

// Ejecutar el script
hashearContraseñas();