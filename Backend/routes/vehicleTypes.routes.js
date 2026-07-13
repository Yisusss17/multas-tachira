import { Router } from "express"
import { 
    GetAllVehicleTypes, GetVehicleType, 
    CreateNewVehicleType, UpdateExistingVehicleType, DeleteExistingVehicleType 
} from "../controllers/vehicleTypes.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

routes.get("/", verifyToken, GetAllVehicleTypes, Messages)
routes.get("/:id", verifyToken, GetVehicleType, Messages)
routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewVehicleType, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingVehicleType, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingVehicleType, Messages)

export default routes