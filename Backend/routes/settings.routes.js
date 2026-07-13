// Backend/routes/settings.routes.js (CREAR NUEVO ARCHIVO)
import { Router } from "express";
import { verifyToken } from "../auth.middleware.js";
import Messages from "../messages.js";

const routes = Router();

// Todas las rutas requieren autenticación
routes.use(verifyToken);

// Obtener valor diario de UT
routes.get("/ut-daily-value", async (req, res, next) => {
  try {
    // Puedes obtenerlo de una tabla de configuración o usar un valor fijo
    // Por ahora devolvemos un valor fijo
    req.message = { 
      type: "Successfully", 
      message: { value: 0.50 }, 
      status: 200 
    };
    return next();
  } catch (err) {
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

export default routes;