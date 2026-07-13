import { Router } from "express"
import { recoverPassword, changePassword } from "../controllers/password.controller.js" // Importar changePassword
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"

const routes = Router()

// Ruta pública (no necesita autenticación)
routes.post("/recover", recoverPassword, Messages)

// Ruta protegida (requiere autenticación)
routes.put("/change", verifyToken, changePassword, Messages)

export default routes