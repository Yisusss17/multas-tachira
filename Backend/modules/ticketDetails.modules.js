import database from "../database.js"

// Obtener detalles de una multa
export const GetTicketDetailsByTicketId = async (ticketId) => {
    const sql = `
        SELECT
            td.id_detail,
            td.id_ticket,
            td.infraction_id,
            td.registration_timestamp,
            i.violation_description,
            i.ut_quantity
        FROM ticket_details td
        INNER JOIN infractions i
            ON td.infraction_id = i.infraction_id
        WHERE td.id_ticket = $1
        ORDER BY td.id_detail;
    `;

    const { rows } = await database.query(sql, [ticketId]);
    return rows;
};


// Obtener el total de UT de una multa
export const GetTotalUtByTicket = async (ticketId) => {

    const sql = `
        SELECT
            COALESCE(SUM(i.ut_quantity),0) AS total_ut
        FROM ticket_details td
        INNER JOIN infractions i
            ON td.infraction_id=i.infraction_id
        WHERE td.id_ticket=$1;
    `;

    const { rows } = await database.query(sql,[ticketId]);

    return Number(rows[0].total_ut);
};


// Obtener detalle por ID
export const GetTicketDetailById = async (id) => {

    const sql = `
        SELECT
            td.id_detail,
            td.id_ticket,
            td.infraction_id,
            td.registration_timestamp,
            i.violation_description,
            i.ut_quantity
        FROM ticket_details td
        INNER JOIN infractions i
            ON td.infraction_id=i.infraction_id
        WHERE td.id_detail=$1;
    `;

    const { rows } = await database.query(sql,[id]);

    return rows[0];
};


// Agregar detalle
export const AddTicketDetail = async(detail)=>{

    const sql = `
        INSERT INTO ticket_details
        (
            id_ticket,
            infraction_id
        )
        VALUES
        (
            $1,
            $2
        )
        RETURNING *;
    `;

    const { rows } = await database.query(sql,[
        detail.id_ticket,
        detail.infraction_id
    ]);

    return rows[0];

};


// Eliminar detalle
export const RemoveTicketDetail = async(id_detail)=>{

    const sql=`
        DELETE FROM ticket_details
        WHERE id_detail=$1
        RETURNING *;
    `;

    const { rows } = await database.query(sql,[id_detail]);

    return rows[0];

};


// Eliminar todos los detalles
export const RemoveAllTicketDetails = async(ticketId)=>{

    const sql=`
        DELETE FROM ticket_details
        WHERE id_ticket=$1;
    `;

    await database.query(sql,[ticketId]);

};