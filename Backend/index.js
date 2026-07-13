import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./database.js";

// Importación de Rutas
import loginRoutes from "./routes/login.routes.js";
import usersRoutes from "./routes/users.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import driversRoutes from "./routes/drivers.routes.js";
import vehicleTypesRoutes from "./routes/vehicleTypes.routes.js";
import vehiclesRoutes from "./routes/vehicles.routes.js";
import offenderConditionsRoutes from "./routes/offenderConditions.routes.js";
import infractionsRoutes from "./routes/infractions.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import ticketDetailsRoutes from "./routes/ticketDetails.routes.js";
import officersRoutes from "./routes/officers.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import publicSearchRoutes from "./routes/publicSearch.routes.js";


import infractionDataRoutes from "./routes/infraction-data.routes.js"; 
import settingsRoutes from "./routes/settings.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";
import auditRoutes from "./routes/audit.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- RUTAS PÚBLICAS (sin autenticación) ---
app.use("/api/public", publicSearchRoutes);

// --- DEFINICIÓN DE RUTAS ---
app.use("/api/login", loginRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/vehicle-types", vehicleTypesRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/offender-conditions", offenderConditionsRoutes);
app.use("/api/infractions", infractionsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/ticket-details", ticketDetailsRoutes);
app.use("/api/officers", officersRoutes);
app.use("/api/password", passwordRoutes);

app.use("/api", infractionDataRoutes); 
app.use("/api/settings", settingsRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit", auditRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "API de Sistema de Multas funcionando correctamente" });
});

// Verificación de inicio de servicios
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida");
} catch (err) {
    console.error("❌ Error en la inicialización:", err.message);
}

// Define el puerto dinámico de internet, o el 4000 si estás en tu laptop
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo de forma segura en el puerto ${PORT}`);
});