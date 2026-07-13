import database from "../database.js"

// Obtener todos los roles
export const GetRoles = async () => {
    const sql = `SELECT id_rol, name, description FROM roles ORDER BY id_rol;`
    const { rows } = await database.query(sql)
    return rows
}

// Obtener un rol por ID
export const GetRoleById = async (id) => {
    const sql = `SELECT id_rol, name, description FROM roles WHERE id_rol = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener un rol por nombre
export const GetRoleByName = async (name) => {
    const sql = `SELECT id_rol, name, description FROM roles WHERE name = $1;`
    const { rows } = await database.query(sql, [name])
    return rows[0]
}

// Crear un nuevo rol
export const CreateRole = async (role) => {
    const sql = `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *;`
    const { rows } = await database.query(sql, [role.name, role.description])
    return rows[0]
}

// Actualizar un rol
export const UpdateRole = async (id, role) => {
    const sql = `UPDATE roles SET name = $1, description = $2 WHERE id_rol = $3 RETURNING *;`
    const { rows } = await database.query(sql, [role.name, role.description, id])
    return rows[0]
}

// Eliminar un rol
export const DeleteRole = async (id) => {
    const sql = `DELETE FROM roles WHERE id_rol = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}