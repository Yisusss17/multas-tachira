import { Router } from "express"
import { 
    GetAllInfractions, 
    GetInfraction, 
    CreateNewInfraction, 
    UpdateExistingInfraction, 
    DeleteExistingInfraction 
} from "../controllers/infractions.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

// Rutas públicas (solo autenticación)
routes.get("/", verifyToken, GetAllInfractions, Messages)
routes.get("/:id", verifyToken, GetInfraction, Messages)

// Rutas protegidas (solo ADMIN)
routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewInfraction, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingInfraction, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingInfraction, Messages)

export default routes