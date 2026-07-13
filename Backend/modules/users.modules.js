import database from "../database.js"

// ============================================
// FUNCIONES EXISTENTES
// ============================================

// Obtener todos los usuarios
export const GetUsers = async () => {
    const sql = `SELECT u.*, r.name as role_name 
    FROM users u
    INNER JOIN roles r ON r.id_rol = u.id_rol
    ORDER BY u.id_user;`
    
    const { rows } = await database.query(sql)
    return rows
}

// Obtener usuario por ID
export const GetUserById = async (id) => {
    const sql = `SELECT u.*, r.name as role_name 
    FROM users u
    INNER JOIN roles r ON r.id_rol = u.id_rol
    WHERE u.id_user = $1;`
    
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Crear nuevo usuario
export const CreateUser = async (user) => {
    const sql = `INSERT INTO users 
    (identification, first_name, last_name, email, password, id_rol, status, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [
        user.identification,
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.id_rol,
        user.status || 'Active'
    ])
    return rows[0]
}

// Actualizar usuario
export const UpdateUser = async (id, user) => {
    let sql;
    let params;
    
    if (user.password) {
        sql = `UPDATE users 
        SET identification = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        id_rol = $5,
        status = $6,
        password = $7,
        updated_at = CURRENT_TIMESTAMP
        WHERE id_user = $8
        RETURNING *;`
        params = [
            user.identification,
            user.first_name,
            user.last_name,
            user.email,
            user.id_rol,
            user.status,
            user.password,
            id
        ];
    } else {
        sql = `UPDATE users 
        SET identification = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        id_rol = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
        WHERE id_user = $7 
        RETURNING *;`
        params = [
            user.identification,
            user.first_name,
            user.last_name,
            user.email,
            user.id_rol,
            user.status,
            id
        ];
    }
    
    const { rows } = await database.query(sql, params)
    return rows[0]
}

// Eliminar usuario
export const DeleteUser = async (id) => {
    const sql = `DELETE FROM users WHERE id_user = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// ============================================
// FUNCIONES PARA RECUPERACIÓN DE CONTRASEÑA
// ============================================

/**
 * Obtener usuario por email
 */
export const GetUserByEmail = async (email) => {
    const sql = `SELECT * FROM users WHERE email = $1;`
    const { rows } = await database.query(sql, [email])
    return rows[0]
}

/**
 * Actualizar la contraseña de un usuario
 */
export const UpdateUserPassword = async (id, hashedPassword) => {
    const sql = `UPDATE users 
    SET password = $1, updated_at = CURRENT_TIMESTAMP 
    WHERE id_user = $2 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [hashedPassword, id])
    return rows[0]
}

/**
 * Obtener usuario por identificación (cédula)
 */
export const GetUserByIdentification = async (identification) => {
    const sql = `SELECT * FROM users WHERE identification = $1;`
    const { rows } = await database.query(sql, [identification])
    return rows[0]
}

/**
 * Verificar si un email ya existe en el sistema
 */
export const EmailExists = async (email) => {
    const sql = `SELECT COUNT(*) FROM users WHERE email = $1;`
    const { rows } = await database.query(sql, [email])
    return parseInt(rows[0].count) > 0
}

/**
 * Actualizar solo el email y teléfono de un usuario (para perfil)
 */
export const UpdateUserContact = async (id, email, phone) => {
    const sql = `UPDATE users 
    SET email = $1, phone = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE id_user = $3 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [email, phone, id])
    return rows[0]
}

// ============================================
// NUEVA FUNCIÓN PARA PERFIL DE USUARIO
// ============================================

/**
 * Actualizar los datos del perfil del usuario (nombre, apellido, email, teléfono)
 * @param {number} id - ID del usuario
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const UpdateUserProfileModule = async (id, data) => {
    const { first_name, last_name, email, phone } = data
    const sql = `UPDATE users 
                 SET first_name = $1, 
                     last_name = $2, 
                     email = $3, 
                     phone = $4, 
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id_user = $5
                 RETURNING *;`
    const { rows } = await database.query(sql, [
        first_name,
        last_name,
        email,
        phone || null,
        id
    ])
    return rows[0]
}