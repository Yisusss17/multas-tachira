import { 
    GetTickets, GetTicketById, GetTicketsByOfficer, GetTicketsByDriver,
    GetTicketsByDateRange, GetLastTicket, CreateTicket, UpdateTicket,
    UpdateTicketStatus, DeleteTicket
} from "../modules/tickets.modules.js"
import { GetTicketDetailsByTicketId, GetTotalUtByTicket } from "../modules/ticketDetails.modules.js"
import { GetOfficerById } from "../modules/officers.modules.js"
import { GetDriverById } from "../modules/drivers.modules.js"
import { GetVehicleById } from "../modules/vehicles.modules.js"
import { TicketValidation, TicketStatusValidation } from "../validates/ticket.validation.js"
import { RegisterAudit } from "../helpers/audit.helper.js"

// ============================================
// FUNCIÓN AUXILIAR
// ============================================
const generateTicketNumber = async () => {
    const lastTicket = await GetLastTicket()
    if (!lastTicket) {
        return 'MUL001'
    }
    const lastNumber = parseInt(lastTicket.ticket_number.replace('MUL', ''))
    const newNumber = lastNumber + 1
    return `MUL${String(newNumber).padStart(3, '0')}`
}

// ============================================
// OBTENER TODAS LAS MULTAS
// ============================================
export const GetAllTickets = async (req, res, next) => {
    try {
        const tickets = await GetTickets()
        const ticketsWithDetails = await Promise.all(tickets.map(async (ticket) => {
            const details = await GetTicketDetailsByTicketId(ticket.id_ticket)
            return { ...ticket, details }
        }))
        req.message = { type: "Successfully", message: ticketsWithDetails, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetAllTickets:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// OBTENER MULTA POR ID
// ============================================
export const GetTicket = async (req, res, next) => {
    try {
        const { id } = req.params
        const ticket = await GetTicketById(id)
        
        if (!ticket) {
            req.message = { type: "Not Found", message: "Multa no encontrada", status: 404 }
            return next()
        }
        
        const details = await GetTicketDetailsByTicketId(id)
        ticket.details = details
        req.message = { type: "Successfully", message: ticket, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetTicket:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// OBTENER MULTAS POR OFICIAL (ACTUALIZADO)
// ============================================
export const GetTicketsByOfficerCtrl = async (req, res, next) => {
    try {
        const { officerId } = req.params;

        const filters = {
            fechaDesde: req.query.fechaDesde || null,
            fechaHasta: req.query.fechaHasta || null,
            cedula: req.query.cedula || null,
            placa: req.query.placa || null,
            lugar: req.query.lugar || null,
            infraccion: req.query.infraccion || null,
            estado: req.query.estado || null
        };

        const tickets = await GetTicketsByOfficer(officerId, filters);

        req.message = {
            type: "Successfully",
            message: tickets,
            status: 200
        };

        return next();

    } catch (err) {
        console.error("❌ Error en GetTicketsByOfficerCtrl:", err);

        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };

        return next();
    }
}

// ============================================
// OBTENER MULTAS POR CONDUCTOR
// ============================================
export const GetTicketsByDriverCtrl = async (req, res, next) => {
    try {
        const { driverId } = req.params
        const tickets = await GetTicketsByDriver(driverId)
        req.message = { type: "Successfully", message: tickets, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetTicketsByDriverCtrl:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// OBTENER MULTAS POR RANGO DE FECHAS
// ============================================
export const GetTicketsByDateRangeCtrl = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        if (!startDate || !endDate) {
            req.message = { type: "Validation", message: "Se requieren startDate y endDate", status: 400 }
            return next()
        }
        const tickets = await GetTicketsByDateRange(startDate, endDate)
        req.message = { type: "Successfully", message: tickets, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en GetTicketsByDateRangeCtrl:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// CREAR NUEVA MULTA
// ============================================
export const CreateNewTicket = async (req, res, next) => {
    try {
        console.log("📥 Creando nueva multa:", req.body)
        
        const { error, value } = TicketValidation.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        if (!value.ticket_number || value.ticket_number === '') {
            value.ticket_number = await generateTicketNumber()
        }
        
        const officer = await GetOfficerById(value.id_officer)
        if (!officer) {
            req.message = { type: "Not Found", message: "Oficial no encontrado", status: 404 }
            return next()
        }
        
        const driver = await GetDriverById(value.id_driver)
        if (!driver) {
            req.message = { type: "Not Found", message: "Conductor no encontrado", status: 404 }
            return next()
        }
        
        const vehicle = await GetVehicleById(value.id_vehicle)
        if (!vehicle) {
            req.message = { type: "Not Found", message: "Vehículo no encontrado", status: 404 }
            return next()
        }
        
        if (!value.issue_timestamp) {
            value.issue_timestamp = new Date()
        }
        
        const newTicket = await CreateTicket(value)

        // ============================================
        // REGISTRAR AUDITORÍA - CREACIÓN
        // ============================================
        await RegisterAudit({
            id_user: req.user.id,
            module: "Tickets",
            action: "CREATE",
            description: `El usuario creó la multa N° ${newTicket.ticket_number} para el conductor ${newTicket.id_driver} utilizando el vehículo ${newTicket.id_vehicle}. La multa quedó registrada con estado "${newTicket.status}" y un total de ${newTicket.total_ut} UT.`,
            reference_id: newTicket.id_ticket
        });

        req.message = { type: "Successfully", message: newTicket, status: 201 }
        return next()
    } catch (err) {
        console.error("❌ Error en CreateNewTicket:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// ACTUALIZAR MULTA
// ============================================
export const UpdateExistingTicket = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = TicketValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        const updatedTicket = await UpdateTicket(id, value)
        
        if (!updatedTicket) {
            req.message = { type: "Not Found", message: "Multa no encontrada", status: 404 }
            return next()
        }

        // ============================================
        // REGISTRAR AUDITORÍA - ACTUALIZACIÓN
        // ============================================
        await RegisterAudit({
            id_user: req.user.id,
            module: "Tickets",
            action: "UPDATE",
            description: `El usuario modificó la multa N° ${updatedTicket.ticket_number}. Se actualizaron los datos asociados a la infracción, incluyendo la información del lugar y/o las infracciones relacionadas con el registro.`,
            reference_id: updatedTicket.id_ticket
        });
        
        req.message = { type: "Successfully", message: updatedTicket, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateExistingTicket:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// ACTUALIZAR ESTADO DE LA MULTA
// ============================================
export const UpdateTicketStatusCtrl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = TicketStatusValidation.validate(req.body)
        
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        
        const updatedTicket = await UpdateTicketStatus(id, value.status)
        
        if (!updatedTicket) {
            req.message = { type: "Not Found", message: "Multa no encontrada", status: 404 }
            return next()
        }

        // ============================================
        // REGISTRAR AUDITORÍA - CAMBIO DE ESTADO
        // ============================================
        await RegisterAudit({
            id_user: req.user.id,
            module: "Tickets",
            action: "STATUS",
            description: `El usuario cambió el estado de la multa N° ${updatedTicket.ticket_number} a "${value.status}".`,
            reference_id: updatedTicket.id_ticket
        });
        
        req.message = { type: "Successfully", message: updatedTicket, status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en UpdateTicketStatusCtrl:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// ============================================
// ELIMINAR MULTA
// ============================================
export const DeleteExistingTicket = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedTicket = await DeleteTicket(id)
        
        if (!deletedTicket) {
            req.message = { type: "Not Found", message: "Multa no encontrada", status: 404 }
            return next()
        }

        // ============================================
        // REGISTRAR AUDITORÍA - ELIMINACIÓN
        // ============================================
        await RegisterAudit({
            id_user: req.user.id,
            module: "Tickets",
            action: "DELETE",
            description: `El usuario eliminó la multa N° ${deletedTicket.ticket_number} del sistema.`,
            reference_id: deletedTicket.id_ticket
        });
        
        req.message = { type: "Successfully", message: "Multa eliminada correctamente", status: 200 }
        return next()
    } catch (err) {
        console.error("❌ Error en DeleteExistingTicket:", err)
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}