import { Router } from "express";
import {
    GetStats,
    GetTicketsByMonthCtrl,
    GetTicketsByStatusCtrl,
    GetTicketsByOfficerCtrl,
    GetTicketsByInfractionCtrl,
    GetRecentTicketsCtrl
} from "../controllers/dashboard.controller.js";
import Messages from "../messages.js";
import { verifyToken } from "../auth.middleware.js";

const routes = Router();

// Todas las rutas requieren autenticación
routes.use(verifyToken);

routes.get("/stats", GetStats, Messages);
routes.get("/tickets-by-month", GetTicketsByMonthCtrl, Messages);
routes.get("/tickets-by-status", GetTicketsByStatusCtrl, Messages);
routes.get("/tickets-by-officer", GetTicketsByOfficerCtrl, Messages);
routes.get("/tickets-by-infraction", GetTicketsByInfractionCtrl, Messages);
routes.get("/recent-tickets", GetRecentTicketsCtrl, Messages);

export default routes;