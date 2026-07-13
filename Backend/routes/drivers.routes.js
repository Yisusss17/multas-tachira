import { Router } from "express"
import { 
    GetAllDrivers, GetDriver, GetDriverByIdentificationCtrl,
    CreateNewDriver, UpdateExistingDriver, DeleteExistingDriver 
} from "../controllers/drivers.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

routes.get("/", verifyToken, GetAllDrivers, Messages)
routes.get("/:id", verifyToken, GetDriver, Messages)
routes.get("/identification/:identification", verifyToken, GetDriverByIdentificationCtrl, Messages)  // ← Nombre actualizado

routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewDriver, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingDriver, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingDriver, Messages)

export default routes