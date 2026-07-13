// Backend/routes/tickets.routes.js
import { Router } from "express"
import { 
    GetAllTickets, GetTicket, GetTicketsByOfficerCtrl, GetTicketsByDriverCtrl,
    GetTicketsByDateRangeCtrl, CreateNewTicket, UpdateExistingTicket,
    UpdateTicketStatusCtrl, DeleteExistingTicket
} from "../controllers/tickets.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"
import database from "../database.js"

const routes = Router()

// ✅ PRIMERO: Rutas específicas (ANTES de las rutas con parámetros)
routes.get("/last", verifyToken, async (req, res, next) => {
  try {
    const sql = `SELECT ticket_number FROM tickets ORDER BY id_ticket DESC LIMIT 1`
    const { rows } = await database.query(sql)
    req.message = { 
      type: "Successfully", 
      message: rows[0] || null, 
      status: 200 
    }
    return next()
  } catch (err) {
    console.error("❌ Error obteniendo último ticket:", err)
    req.message = { 
      type: "Error", 
      message: err.message, 
      status: 500 
    }
    return next()
  }
}, Messages)

// ✅ LUEGO: Rutas con parámetros
routes.get("/", verifyToken, GetAllTickets, Messages)
routes.get("/:id", verifyToken, GetTicket, Messages)
routes.get("/officer/:officerId", verifyToken, GetTicketsByOfficerCtrl, Messages)
routes.get("/driver/:driverId", verifyToken, GetTicketsByDriverCtrl, Messages)
routes.get("/date-range", verifyToken, GetTicketsByDateRangeCtrl, Messages)

// 🔥 MODIFICADO: Ahora también permite el rol 'Agent'
routes.post("/", verifyToken, hasRole(['Administrative Authority', 'Agent']), CreateNewTicket, Messages)
routes.put("/:id", verifyToken, hasRole(['Administrative Authority', 'Agent']), UpdateExistingTicket, Messages)

// Resto de rutas sin cambios
routes.patch("/:id/status", verifyToken, hasRole(['Administrative Authority', 'jefe_policia']), UpdateTicketStatusCtrl, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingTicket, Messages)

export default routes