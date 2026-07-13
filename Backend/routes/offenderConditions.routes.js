import { Router } from "express"
import { 
    GetAllOffenderConditions, GetOffenderCondition, 
    CreateNewOffenderCondition, UpdateExistingOffenderCondition, DeleteExistingOffenderCondition 
} from "../controllers/offenderConditions.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

routes.get("/", verifyToken, GetAllOffenderConditions, Messages)
routes.get("/:id", verifyToken, GetOffenderCondition, Messages)
routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewOffenderCondition, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingOffenderCondition, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingOffenderCondition, Messages)

export default routes