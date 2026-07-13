import { Router } from "express"
import { 
    GetAllRoles, GetRole, GetRoleByNameController,
    CreateNewRole, UpdateExistingRole, DeleteExistingRole 
} from "../controllers/roles.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

// Rutas públicas (solo autenticación)
routes.get("/", verifyToken, GetAllRoles, Messages)
routes.get("/:id", verifyToken, GetRole, Messages)
routes.get("/name/:name", verifyToken, GetRoleByNameController, Messages)

// Rutas protegidas (solo ADMIN)
routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewRole, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingRole, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingRole, Messages)

export default routes