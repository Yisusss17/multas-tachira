import { Router } from "express"
import { 
    GetTicketDetails, AddDetailToTicket, RemoveDetailFromTicket
} from "../controllers/ticketDetails.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

routes.get("/ticket/:ticketId", verifyToken, GetTicketDetails, Messages)
routes.post("/", verifyToken, hasRole(['Administrative Authority', 'Agent']), AddDetailToTicket, Messages);
routes.delete("/:id_detail", verifyToken, hasRole(['Administrative Authority', 'Agent']), RemoveDetailFromTicket, Messages)

export default routes