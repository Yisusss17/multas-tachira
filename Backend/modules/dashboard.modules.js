import database from "../database.js";

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================
export const GetDashboardStats = async () => {
    // Total de tickets (con filtro por estado)
    const ticketsQuery = `SELECT COUNT(*) as total FROM tickets`;
    const pendingQuery = `SELECT COUNT(*) as pending FROM tickets WHERE status = 'Pending'`;
    const paidQuery = `SELECT COUNT(*) as paid FROM tickets WHERE status = 'Paid'`;
    const cancelledQuery = `SELECT COUNT(*) as cancelled FROM tickets WHERE status = 'Cancelled'`;

    // Totales de otras tablas (sin filtrar por status para evitar errores)
    const officersQuery = `SELECT COUNT(*) as officers FROM officers`;
    const driversQuery = `SELECT COUNT(*) as drivers FROM drivers`;
    const vehiclesQuery = `SELECT COUNT(*) as vehicles FROM vehicles`;
    const infractionsQuery = `SELECT COUNT(*) as infractions FROM infractions`;

    const [
        totalResult,
        pendingResult,
        paidResult,
        cancelledResult,
        officersResult,
        driversResult,
        vehiclesResult,
        infractionsResult
    ] = await Promise.all([
        database.query(ticketsQuery),
        database.query(pendingQuery),
        database.query(paidQuery),
        database.query(cancelledQuery),
        database.query(officersQuery),
        database.query(driversQuery),
        database.query(vehiclesQuery),
        database.query(infractionsQuery)
    ]);

    return {
        totalTickets: parseInt(totalResult.rows[0].total),
        pendingTickets: parseInt(pendingResult.rows[0].pending),
        paidTickets: parseInt(paidResult.rows[0].paid),
        cancelledTickets: parseInt(cancelledResult.rows[0].cancelled),
        totalOfficers: parseInt(officersResult.rows[0].officers),
        totalDrivers: parseInt(driversResult.rows[0].drivers),
        totalVehicles: parseInt(vehiclesResult.rows[0].vehicles),
        totalInfractions: parseInt(infractionsResult.rows[0].infractions)
    };
};

// ============================================
// MULTAS POR MES
// ============================================
export const GetTicketsByMonth = async () => {
    const sql = `
        SELECT 
            TO_CHAR(issue_timestamp, 'YYYY-MM') as month,
            COUNT(*) as count
        FROM tickets
        WHERE issue_timestamp >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month ASC
    `;
    const { rows } = await database.query(sql);
    
    // Formatear meses como "Ene", "Feb", etc.
    const monthsMap = {
        '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
    };
    
    const months = rows.map(row => {
        const parts = row.month.split('-');
        return monthsMap[parts[1]] + ' ' + parts[0];
    });
    const data = rows.map(row => parseInt(row.count));
    
    return { months, data };
};

// ============================================
// MULTAS POR ESTADO
// ============================================
export const GetTicketsByStatus = async () => {
    const sql = `
        SELECT 
            status,
            COUNT(*) as count
        FROM tickets
        GROUP BY status
    `;
    const { rows } = await database.query(sql);
    
    const result = {};
    rows.forEach(row => {
        result[row.status.toLowerCase()] = parseInt(row.count);
    });
    // Asegurar que todos los estados existan
    return {
        pending: result.pending || 0,
        paid: result.paid || 0,
        cancelled: result.cancelled || 0
    };
};

// ============================================
// MULTAS POR OFICIAL (TOP 5)
// ============================================
export const GetTicketsByOfficer = async () => {
    const sql = `
        SELECT 
            u.first_name,
            u.last_name,
            COUNT(t.id_ticket) as count
        FROM tickets t
        JOIN officers o ON t.id_officer = o.id_officer
        JOIN users u ON o.id_user = u.id_user
        GROUP BY u.id_user, u.first_name, u.last_name
        ORDER BY count DESC
        LIMIT 5
    `;
    const { rows } = await database.query(sql);
    
    const officers = rows.map(row => `${row.first_name} ${row.last_name}`);
    const data = rows.map(row => parseInt(row.count));
    
    return { officers, data };
};

// ============================================
// MULTAS POR INFRACCIÓN (TOP 5)
// ============================================
export const GetTicketsByInfraction = async () => {
    const sql = `
        SELECT 
            i.violation_description,
            COUNT(td.id_detail) as count
        FROM ticket_details td
        JOIN infractions i ON td.infraction_id = i.infraction_id
        GROUP BY i.infraction_id, i.violation_description
        ORDER BY count DESC
        LIMIT 5
    `;
    const { rows } = await database.query(sql);
    
    const infractions = rows.map(row => row.violation_description);
    const data = rows.map(row => parseInt(row.count));
    
    return { infractions, data };
};

// ============================================
// ÚLTIMAS MULTAS
// ============================================
export const GetRecentTickets = async () => {
    const sql = `
        SELECT 
            t.ticket_number,
            t.location,
            t.status,
            t.issue_timestamp,
            CONCAT(d.first_name, ' ', d.last_name) as driver_name,
            v.plate as vehicle_plate,
            t.total_ut,
            t.ut_daily_value_bs,
            COALESCE(t.total_ut, 0) * COALESCE(t.ut_daily_value_bs, 0) as total_bs
        FROM tickets t
        LEFT JOIN drivers d ON t.id_driver = d.id_driver
        LEFT JOIN vehicles v ON t.id_vehicle = v.id_vehicle
        ORDER BY t.issue_timestamp DESC
        LIMIT 5
    `;
    const { rows } = await database.query(sql);
    return rows;
};