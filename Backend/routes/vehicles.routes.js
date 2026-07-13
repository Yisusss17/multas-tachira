import { Router } from "express"
import { 
    GetAllVehicles, GetVehicle, GetVehicleByPlateCtrl, GetVehiclesByDriverCtrl,
    CreateNewVehicle, UpdateExistingVehicle, DeleteExistingVehicle 
} from "../controllers/vehicles.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"

const routes = Router()

// Rutas públicas (solo autenticación)
routes.get("/", verifyToken, GetAllVehicles, Messages)
routes.get("/plate/:plate", verifyToken, GetVehicleByPlateCtrl, Messages)
routes.get("/:id", verifyToken, GetVehicle, Messages)
routes.get("/driver/:driverId", verifyToken, GetVehiclesByDriverCtrl, Messages)

// Rutas protegidas (solo ADMIN)
routes.post("/", verifyToken, hasRole('Administrative Authority'), CreateNewVehicle, Messages)
routes.put("/:id", verifyToken, hasRole('Administrative Authority'), UpdateExistingVehicle, Messages)
routes.delete("/:id", verifyToken, hasRole('Administrative Authority'), DeleteExistingVehicle, Messages)

export default routes