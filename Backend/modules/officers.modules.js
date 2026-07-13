import database from "../database.js"

// Obtener todos los oficiales
export const GetOfficers = async () => {
    const sql = `SELECT o.*, 
                    u.id_user, u.identification, u.first_name, u.last_name, u.email, u.status as user_status,
                    r.name as role_name
                 FROM officers o
                 INNER JOIN users u ON o.id_user = u.id_user
                 INNER JOIN roles r ON u.id_rol = r.id_rol
                 ORDER BY o.id_officer;`
    const { rows } = await database.query(sql)
    return rows
}

// Obtener oficial por ID
export const GetOfficerById = async (id) => {
    const sql = `SELECT o.*, 
                    u.id_user, u.identification, u.first_name, u.last_name, u.email, u.status as user_status,
                    r.name as role_name
                 FROM officers o
                 INNER JOIN users u ON o.id_user = u.id_user
                 INNER JOIN roles r ON u.id_rol = r.id_rol
                 WHERE o.id_officer = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener oficial por ID de usuario
export const GetOfficerByUserId = async (userId) => {
    const sql = `SELECT o.*, 
                    u.id_user, u.identification, u.first_name, u.last_name, u.email, u.status as user_status
                 FROM officers o
                 INNER JOIN users u ON o.id_user = u.id_user
                 WHERE u.id_user = $1;`
    const { rows } = await database.query(sql, [userId])
    return rows[0]
}

// Obtener oficial por código de placa
export const GetOfficerByBadgeCode = async (badgeCode) => {
    const sql = `SELECT o.*, 
                    u.id_user, u.identification, u.first_name, u.last_name, u.email
                 FROM officers o
                 INNER JOIN users u ON o.id_user = u.id_user
                 WHERE o.badge_code = $1;`
    const { rows } = await database.query(sql, [badgeCode])
    return rows[0]
}

// Crear nuevo oficial (asociado a un usuario existente)
export const CreateOfficer = async (officer) => {
    const sql = `INSERT INTO officers (status, badge_code, id_user) 
                 VALUES ($1, $2, $3) RETURNING *;`
    const { rows } = await database.query(sql, [
        officer.status || 'Active',
        officer.badge_code,
        officer.id_user
    ])
    return rows[0]
}

// Actualizar oficial
export const UpdateOfficer = async (id, officer) => {
    const sql = `UPDATE officers 
                 SET status = $1, badge_code = $2
                 WHERE id_officer = $3 RETURNING *;`
    const { rows } = await database.query(sql, [
        officer.status,
        officer.badge_code,
        id
    ])
    return rows[0]
}

// Actualizar solo el estado del oficial
export const UpdateOfficerStatus = async (id, status) => {
    const sql = `UPDATE officers SET status = $1 WHERE id_officer = $2 RETURNING *;`
    const { rows } = await database.query(sql, [status, id])
    return rows[0]
}

// Eliminar oficial
export const DeleteOfficer = async (id) => {
    const sql = `DELETE FROM officers WHERE id_officer = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener estadísticas de oficiales
export const GetOfficersStats = async () => {
    const sql = `SELECT 
                    COUNT(*) as total_officers,
                    SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_officers,
                    SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive_officers
                 FROM officers;`
    const { rows } = await database.query(sql)
    return rows[0]
}