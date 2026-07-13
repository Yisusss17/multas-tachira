import { Router } from "express";

import { GetAllAudits } from "../controllers/audit.controller.js";

import Messages from "../messages.js";

import { verifyToken } from "../auth.middleware.js";

import { hasRole } from "../middlewares/role.middleware.js";

const routes = Router();

routes.get(
    "/",
    verifyToken,
    hasRole("Administrative Authority"),
    GetAllAudits,
    Messages
);

export default routes;