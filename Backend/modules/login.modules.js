import database from "../database.js"

export const Login = async (email) => {

    const sql = `
        SELECT
            u.id_user,
            u.first_name,
            u.last_name,
            u.identification,
            u.email,
            u.password,
            u.status,

            r.id_rol,
            r.name AS role_nombre,

            o.badge_code

        FROM users u

        INNER JOIN roles r
            ON r.id_rol = u.id_rol

        LEFT JOIN officers o
            ON o.id_user = u.id_user

        WHERE LOWER(u.email) = LOWER($1)
        AND u.status = 'Active';
    `

    const { rowCount, rows } = await database.query(sql, [email])

    return {
        results: rowCount,
        data: rows[0]
    }
}