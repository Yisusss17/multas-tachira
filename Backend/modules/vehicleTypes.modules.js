import database from "../database.js"

export const GetVehicleTypes = async () => {
    const sql = `SELECT * FROM vehicle_types ORDER BY id_vehicle_type;`
    const { rows } = await database.query(sql)
    return rows
}

export const GetVehicleTypeById = async (id) => {
    const sql = `SELECT * FROM vehicle_types WHERE id_vehicle_type = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

export const CreateVehicleType = async (type) => {
    const sql = `INSERT INTO vehicle_types (name, description) VALUES ($1, $2) RETURNING *;`
    const { rows } = await database.query(sql, [type.name, type.description])
    return rows[0]
}

export const UpdateVehicleType = async (id, type) => {
    const sql = `UPDATE vehicle_types SET name = $1, description = $2 WHERE id_vehicle_type = $3 RETURNING *;`
    const { rows } = await database.query(sql, [type.name, type.description, id])
    return rows[0]
}

export const DeleteVehicleType = async (id) => {
    const sql = `DELETE FROM vehicle_types WHERE id_vehicle_type = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}