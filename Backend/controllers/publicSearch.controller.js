import database from "../database.js"

// ============================================
// BUSCAR MULTAS POR PLACA (PÚBLICO)
// ============================================
export const SearchByPlate = async (req, res, next) => {
    try {
        const { plate } = req.params

        // ==========================
        // Buscar vehículo
        // ==========================
        const vehicleSql = `
            SELECT
                v.*,
                vt.name AS vehicle_type_name,
                CONCAT(d.first_name,' ',d.last_name) AS owner_name,
                d.identification AS owner_identification
            FROM vehicles v
            LEFT JOIN vehicle_types vt
                ON v.id_vehicle_type = vt.id_vehicle_type
            LEFT JOIN drivers d
                ON v.id_driver = d.id_driver
            WHERE UPPER(v.plate)=UPPER($1);
        `

        const vehicleResult = await database.query(vehicleSql, [plate])

        if (vehicleResult.rows.length === 0) {
            req.message = {
                type: "Not Found",
                message: "No se encontró ningún vehículo con esa placa",
                status: 404
            }
            return next()
        }

        const vehicle = vehicleResult.rows[0]

        // ==========================
        // Buscar multas
        // ==========================
        const ticketsSql = `
            SELECT
                t.*,
                o.badge_code AS officer_badge,
                CONCAT(officer.first_name,' ',officer.last_name) AS officer_name,
                CONCAT(d.first_name,' ',d.last_name) AS driver_name,
                d.identification AS driver_identification,
                v.plate AS vehicle_plate,
                v.brand AS vehicle_brand,
                v.model AS vehicle_model,
                v.color AS vehicle_color,
                oc.name AS condition_name
            FROM tickets t
            LEFT JOIN officers o
                ON t.id_officer = o.id_officer
            LEFT JOIN users officer
                ON o.id_user = officer.id_user
            LEFT JOIN drivers d
                ON t.id_driver = d.id_driver
            LEFT JOIN vehicles v
                ON t.id_vehicle = v.id_vehicle
            LEFT JOIN offender_conditions oc
                ON t.id_condition = oc.id_condition
            WHERE t.id_vehicle = $1
            ORDER BY t.issue_timestamp DESC;
        `

        const ticketsResult = await database.query(
            ticketsSql,
            [vehicle.id_vehicle]
        )

        // ==========================
        // Obtener infracciones
        // ==========================
        const ticketsWithDetails = await Promise.all(
            ticketsResult.rows.map(async (ticket) => {

                const detailsSql = `
                    SELECT
                        td.id_detail,
                        td.id_ticket,
                        td.infraction_id,
                        i.violation_description,
                        i.ut_quantity
                    FROM ticket_details td
                    INNER JOIN infractions i
                        ON td.infraction_id=i.infraction_id
                    WHERE td.id_ticket=$1
                    ORDER BY td.id_detail;
                `

                const detailsResult = await database.query(
                    detailsSql,
                    [ticket.id_ticket]
                )

                return {
                    ...ticket,
                    details: detailsResult.rows
                }

            })
        )

        req.message = {
            type: "Successfully",
            message: {
                vehicle,
                tickets: ticketsWithDetails,
                total_tickets: ticketsWithDetails.length
            },
            status: 200
        }

        return next()

    } catch (err) {

        console.error("❌ Error en SearchByPlate:", err)

        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        }

        return next()
    }
}

// ============================================
// BUSCAR MULTAS POR CÉDULA (PÚBLICO)
// ============================================
export const SearchByIdentification = async (req, res, next) => {

    try {

        const { identification } = req.params

        // ==========================
        // Buscar conductor
        // ==========================
        const driverSql = `
            SELECT *
            FROM drivers
            WHERE UPPER(identification)=UPPER($1);
        `

        const driverResult = await database.query(
            driverSql,
            [identification]
        )

        if (driverResult.rows.length === 0) {

            req.message = {
                type: "Not Found",
                message: "No se encontró ningún conductor con esa cédula",
                status: 404
            }

            return next()
        }

        const driver = driverResult.rows[0]

        // ==========================
        // Buscar multas
        // ==========================
        const ticketsSql = `
            SELECT
                t.*,
                o.badge_code AS officer_badge,
                CONCAT(officer.first_name,' ',officer.last_name) AS officer_name,
                CONCAT(d.first_name,' ',d.last_name) AS driver_name,
                d.identification AS driver_identification,
                v.plate AS vehicle_plate,
                v.brand AS vehicle_brand,
                v.model AS vehicle_model,
                v.color AS vehicle_color,
                oc.name AS condition_name
            FROM tickets t
            LEFT JOIN officers o
                ON t.id_officer=o.id_officer
            LEFT JOIN users officer
                ON o.id_user=officer.id_user
            LEFT JOIN drivers d
                ON t.id_driver=d.id_driver
            LEFT JOIN vehicles v
                ON t.id_vehicle=v.id_vehicle
            LEFT JOIN offender_conditions oc
                ON t.id_condition=oc.id_condition
            WHERE t.id_driver=$1
            ORDER BY t.issue_timestamp DESC;
        `

        const ticketsResult = await database.query(
            ticketsSql,
            [driver.id_driver]
        )

        // ==========================
        // Obtener infracciones
        // ==========================
        const ticketsWithDetails = await Promise.all(
            ticketsResult.rows.map(async (ticket) => {

                const detailsSql = `
                    SELECT
                        td.id_detail,
                        td.id_ticket,
                        td.infraction_id,
                        i.violation_description,
                        i.ut_quantity
                    FROM ticket_details td
                    INNER JOIN infractions i
                        ON td.infraction_id=i.infraction_id
                    WHERE td.id_ticket=$1
                    ORDER BY td.id_detail;
                `

                const detailsResult = await database.query(
                    detailsSql,
                    [ticket.id_ticket]
                )

                return {
                    ...ticket,
                    details: detailsResult.rows
                }

            })
        )

        req.message = {
            type: "Successfully",
            message: {
                driver,
                tickets: ticketsWithDetails,
                total_tickets: ticketsWithDetails.length
            },
            status: 200
        }

        return next()

    } catch (err) {

        console.error("❌ Error en SearchByIdentification:", err)

        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        }

        return next()
    }
}