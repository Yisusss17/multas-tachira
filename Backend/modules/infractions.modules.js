import database from "../database.js"

export const GetInfractions = async () => {
    const sql = `SELECT * FROM infractions ORDER BY infraction_id;`
    const { rows } = await database.query(sql)
    return rows
}

export const GetInfractionById = async (id) => {
    const sql = `SELECT * FROM infractions WHERE infraction_id = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

export const CreateInfraction = async (infraction) => {
    const sql = `INSERT INTO infractions (violation_description, ut_quantity) 
                 VALUES ($1, $2) RETURNING *;`
    const { rows } = await database.query(sql, [
        infraction.violation_description,
        infraction.ut_quantity  // ← Cambiado de ut_cost a ut_quantity
    ])
    return rows[0]
}

export const UpdateInfraction = async (id, infraction) => {
    const sql = `UPDATE infractions 
                 SET violation_description = $1, ut_quantity = $2 
                 WHERE infraction_id = $3 RETURNING *;`
    const { rows } = await database.query(sql, [
        infraction.violation_description,
        infraction.ut_quantity,  // ← Cambiado de ut_cost a ut_quantity
        id
    ])
    return rows[0]
}

export const DeleteInfraction = async (id) => {
    const sql = `DELETE FROM infractions WHERE infraction_id = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}