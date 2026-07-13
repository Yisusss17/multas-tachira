import database from "../database.js";

// Registrar auditoría
export const CreateAudit = async (audit) => {

    const sql = `
        INSERT INTO audit_logs
        (
            id_user,
            module,
            action,
            description,
            reference_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *;
    `;

    const { rows } = await database.query(sql, [
        audit.id_user,
        audit.module,
        audit.action,
        audit.description,
        audit.reference_id
    ]);

    return rows[0];

};

// Obtener historial completo
export const GetAudits = async () => {

    const sql = `
        SELECT
            a.*,
            u.first_name,
            u.last_name
        FROM audit_logs a
        INNER JOIN users u
            ON a.id_user = u.id_user
        ORDER BY a.created_at DESC;
    `;

    const { rows } = await database.query(sql);

    return rows;

};