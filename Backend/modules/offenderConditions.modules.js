import database from "../database.js"

export const GetOffenderConditions = async () => {
    const sql = `SELECT * FROM offender_conditions ORDER BY id_condition;`
    const { rows } = await database.query(sql)
    return rows
}

export const GetOffenderConditionById = async (id) => {
    const sql = `SELECT * FROM offender_conditions WHERE id_condition = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

export const GetOffenderConditionByName = async (name) => {
    const sql = `SELECT * FROM offender_conditions WHERE name = $1;`
    const { rows } = await database.query(sql, [name])
    return rows[0]
}

export const CreateOffenderCondition = async (condition) => {
    const sql = `INSERT INTO offender_conditions (name, description) VALUES ($1, $2) RETURNING *;`
    const { rows } = await database.query(sql, [condition.name, condition.description])
    return rows[0]
}

export const UpdateOffenderCondition = async (id, condition) => {
    const sql = `UPDATE offender_conditions SET name = $1, description = $2 WHERE id_condition = $3 RETURNING *;`
    const { rows } = await database.query(sql, [condition.name, condition.description, id])
    return rows[0]
}

export const DeleteOffenderCondition = async (id) => {
    const sql = `DELETE FROM offender_conditions WHERE id_condition = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}