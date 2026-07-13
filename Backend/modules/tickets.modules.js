import database from "../database.js"

// Obtener todas las multas
export const GetTickets = async () => {
    const sql = `SELECT t.*, 
                    o.badge_code as officer_badge,
                    CONCAT(officer.first_name, ' ', officer.last_name) as officer_name,
                    CONCAT(d.first_name, ' ', d.last_name) as driver_name,
                    d.identification as driver_identification,
                    v.plate as vehicle_plate,
                    v.brand as vehicle_brand,
                    v.model as vehicle_model,
                    oc.name as condition_name,
                    COALESCE(SUM(i.ut_quantity), 0) as total_calculated_ul
                 FROM tickets t
                 LEFT JOIN officers o ON t.id_officer = o.id_officer
                 LEFT JOIN users officer ON o.id_user = officer.id_user
                 LEFT JOIN drivers d ON t.id_driver = d.id_driver
                 LEFT JOIN vehicles v ON t.id_vehicle = v.id_vehicle
                 LEFT JOIN offender_conditions oc ON t.id_condition = oc.id_condition
                 LEFT JOIN ticket_details td ON t.id_ticket = td.id_ticket
                 LEFT JOIN infractions i ON td.infraction_id = i.infraction_id
                 GROUP BY t.id_ticket, o.badge_code, officer.first_name, officer.last_name,
                          d.first_name, d.last_name, d.identification, v.plate, v.brand, 
                          v.model, oc.name
                 ORDER BY t.issue_timestamp DESC;`
    const { rows } = await database.query(sql)
    return rows
}

// Obtener multa por ID
export const GetTicketById = async (id) => {
    const sql = `SELECT t.*, 
                    o.badge_code as officer_badge,
                    CONCAT(officer.first_name, ' ', officer.last_name) as officer_name,
                    CONCAT(d.first_name, ' ', d.last_name) as driver_name,
                    d.identification as driver_identification,
                    v.plate as vehicle_plate,
                    v.brand as vehicle_brand,
                    v.model as vehicle_model,
                    oc.name as condition_name
                 FROM tickets t
                 LEFT JOIN officers o ON t.id_officer = o.id_officer
                 LEFT JOIN users officer ON o.id_user = officer.id_user
                 LEFT JOIN drivers d ON t.id_driver = d.id_driver
                 LEFT JOIN vehicles v ON t.id_vehicle = v.id_vehicle
                 LEFT JOIN offender_conditions oc ON t.id_condition = oc.id_condition
                 WHERE t.id_ticket = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener multas por oficial (ACTUALIZADO CON FILTROS)
export const GetTicketsByOfficer = async (officerId, filters = {}) => {
    let sql = `
        SELECT
            t.*,

            CONCAT(d.first_name, ' ', d.last_name) AS driver_name,
            d.identification AS driver_identification,

            v.plate AS vehicle_plate,

            STRING_AGG(
                i.violation_description,
                ', '
                ORDER BY i.violation_description
            ) AS infractions

        FROM tickets t

        LEFT JOIN drivers d
            ON t.id_driver = d.id_driver

        LEFT JOIN vehicles v
            ON t.id_vehicle = v.id_vehicle

        LEFT JOIN ticket_details td
            ON t.id_ticket = td.id_ticket

        LEFT JOIN infractions i
            ON td.infraction_id = i.infraction_id

        WHERE t.id_officer = $1
    `;

    const params = [officerId];
    let index = 2;

    // Filtros dinámicos
    if (filters.cedula) {
        sql += ` AND d.identification ILIKE $${index}`;
        params.push(`%${filters.cedula}%`);
        index++;
    }

    if (filters.placa) {
        sql += ` AND v.plate ILIKE $${index}`;
        params.push(`%${filters.placa}%`);
        index++;
    }

    if (filters.lugar) {
        sql += ` AND t.location ILIKE $${index}`;
        params.push(`%${filters.lugar}%`);
        index++;
    }

    if (filters.estado) {
        sql += ` AND t.status = $${index}`;
        params.push(filters.estado);
        index++;
    }

    if (filters.fechaDesde) {
        sql += ` AND DATE(t.issue_timestamp) >= $${index}`;
        params.push(filters.fechaDesde);
        index++;
    }

    if (filters.fechaHasta) {
        sql += ` AND DATE(t.issue_timestamp) <= $${index}`;
        params.push(filters.fechaHasta);
        index++;
    }

    if (filters.infraccion) {
        sql += ` AND i.violation_description ILIKE $${index}`;
        params.push(`%${filters.infraccion}%`);
        index++;
    }

    sql += `
        GROUP BY
            t.id_ticket,
            d.first_name,
            d.last_name,
            d.identification,
            v.plate

        ORDER BY
            t.issue_timestamp DESC
    `;

    const { rows } = await database.query(sql, params);
    return rows;
}

// Obtener multas por conductor
export const GetTicketsByDriver = async (driverId) => {
    const sql = `SELECT t.*, 
                    CONCAT(officer.first_name, ' ', officer.last_name) as officer_name
                 FROM tickets t
                 LEFT JOIN officers o ON t.id_officer = o.id_officer
                 LEFT JOIN users officer ON o.id_user = officer.id_user
                 WHERE t.id_driver = $1
                 ORDER BY t.issue_timestamp DESC;`
    const { rows } = await database.query(sql, [driverId])
    return rows
}

// Obtener multas por rango de fechas
export const GetTicketsByDateRange = async (startDate, endDate) => {
    const sql = `SELECT t.*, 
                    CONCAT(d.first_name, ' ', d.last_name) as driver_name,
                    v.plate as vehicle_plate
                 FROM tickets t
                 LEFT JOIN drivers d ON t.id_driver = d.id_driver
                 LEFT JOIN vehicles v ON t.id_vehicle = v.id_vehicle
                 WHERE t.issue_timestamp BETWEEN $1 AND $2
                 ORDER BY t.issue_timestamp DESC;`
    const { rows } = await database.query(sql, [startDate, endDate])
    return rows
}

// Obtener última multa (para generar número de boleta)
export const GetLastTicket = async () => {
    const sql = `SELECT ticket_number FROM tickets ORDER BY id_ticket DESC LIMIT 1;`
    const { rows } = await database.query(sql)
    return rows[0]
}

// Crear nueva multa
export const CreateTicket = async (ticket) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')
        
        const sqlTicket = `INSERT INTO tickets (
    ticket_number, id_officer, id_driver, id_vehicle, id_condition, 
    location, issue_timestamp, status, observations, 
    ut_daily_value_bs, total_ut
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`
        
        const ticketResult = await client.query(sqlTicket, [
            ticket.ticket_number,
            ticket.id_officer,
            ticket.id_driver,
            ticket.id_vehicle,
            ticket.id_condition,
            ticket.location,
            ticket.issue_timestamp || new Date(),
            ticket.status || 'Pending',
            ticket.observations,
            ticket.ut_daily_value_bs,
            ticket.total_ut || 0
        ])
        
        await client.query('COMMIT')
        return ticketResult.rows[0]
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

// Actualizar multa
export const UpdateTicket = async (id, ticket) => {
    const sql = `UPDATE tickets 
    SET ticket_number = $1, id_officer = $2, id_driver = $3, id_vehicle = $4,
    id_condition = $5, location = $6, issue_timestamp = $7, status = $8,
    observations = $9, ut_daily_value_bs = $10, total_ut = $11
    WHERE id_ticket = $12 RETURNING *;`
    
    const { rows } = await database.query(sql, [
        ticket.ticket_number,
        ticket.id_officer,
        ticket.id_driver,
        ticket.id_vehicle,
        ticket.id_condition,
        ticket.location,
        ticket.issue_timestamp,
        ticket.status,
        ticket.observations,
        ticket.ut_daily_value_bs,
        ticket.total_ut,
        id
    ])
    return rows[0]
}

// Actualizar solo el estado de la multa
export const UpdateTicketStatus = async (id, status) => {
    const sql = `UPDATE tickets SET status = $1 WHERE id_ticket = $2 RETURNING *;`
    const { rows } = await database.query(sql, [status, id])
    return rows[0]
}

// Actualizar el total_ut de la multa (renombrado)
export const UpdateTicketTotalUt = async (id, totalUt) => {
    const sql = `UPDATE tickets SET total_ut = $1 WHERE id_ticket = $2 RETURNING *;`
    const { rows } = await database.query(sql, [totalUt, id])
    return rows[0]
}

// Eliminar multa
export const DeleteTicket = async (id) => {
    const sql = `DELETE FROM tickets WHERE id_ticket = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}