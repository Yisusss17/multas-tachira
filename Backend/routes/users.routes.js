import { Router } from "express"
import { 
    GetAllUsers, GetUser, CreateNewUser, 
    UpdateExistingUser, DeleteExistingUser,
    GetUserProfile, UpdateUserProfile
} from "../controllers/users.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"

const routes = Router()

// ============================================
// RUTAS DE PERFIL (antes de :id para evitar conflicto)
// ============================================
routes.get("/profile", verifyToken, GetUserProfile, Messages)
routes.put("/profile", verifyToken, UpdateUserProfile, Messages)

// ============================================
// RUTAS CRUD DE USUARIOS
// ============================================
routes.get("/", verifyToken, GetAllUsers, Messages)
routes.get("/:id", verifyToken, GetUser, Messages)
routes.post("/", verifyToken, CreateNewUser, Messages)
routes.put("/:id", verifyToken, UpdateExistingUser, Messages)
routes.delete("/:id", verifyToken, DeleteExistingUser, Messages)

export default routes