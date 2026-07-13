import { Router } from "express"
import { 
    GetAllOfficers, GetOfficer, GetOfficerByUser, GetOfficerByBadge,
    CreateNewOfficer, UpdateExistingOfficer, UpdateOfficerStatusCtrl,
    DeleteExistingOfficer, GetOfficersStatistics
} from "../controllers/officers.controller.js"
import Messages from "../messages.js"
import { verifyToken } from "../auth.middleware.js"
import { hasRole } from "../middlewares/role.middleware.js"
import database from "../database.js"

const routes = Router()

// Rutas públicas (solo autenticación)
routes.get("/", verifyToken, GetAllOfficers, Messages)
routes.get("/stats", verifyToken, GetOfficersStatistics, Messages)
routes.get("/:id", verifyToken, GetOfficer, Messages)
routes.get("/badge/:badgeCode", verifyToken, GetOfficerByBadge, Messages)

// ============================================
// NUEVA RUTA: Obtener oficial por ID de usuario
// ============================================
routes.get("/user/:userId", verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Buscando oficial para usuario ID: ${userId}`);

    const sql = `
      SELECT o.*, 
             u.id_user, u.identification, u.first_name, u.last_name, u.email,
             r.name as role_name
      FROM officers o
      INNER JOIN users u ON o.id_user = u.id_user
      INNER JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_user = $1
    `;
    
    const { rows } = await database.query(sql, [userId]);
    
    if (rows.length === 0) {
      req.message = { 
        type: "Not Found", 
        message: "Oficial no encontrado para este usuario", 
        status: 404 
      };
      return next();
    }
    
    console.log(`✅ Oficial encontrado: ${rows[0].first_name} ${rows[0].last_name}`);
    req.message = { 
      type: "Successfully", 
      message: rows[0], 
      status: 200 
    };
    return next();
  } catch (err) {
    console.error("❌ Error obteniendo oficial:", err);
    req.message = { 
      type: "Error", 
      message: err.message, 
      status: 500 
    };
    return next();
  }
}, Messages)

// Rutas protegidas (solo ADMIN)
routes.post("/", verifyToken, hasRole("Administrative Authority"), CreateNewOfficer, Messages)
routes.put("/:id", verifyToken, hasRole("Administrative Authority"), UpdateExistingOfficer, Messages)
routes.patch("/:id/status", verifyToken, hasRole("Administrative Authority"), UpdateOfficerStatusCtrl, Messages)
routes.delete("/:id", verifyToken, hasRole("Administrative Authority"), DeleteExistingOfficer, Messages)

export default routes