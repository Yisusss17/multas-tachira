import { Router } from "express"
import { SearchByPlate, SearchByIdentification } from "../controllers/publicSearch.controller.js";
import { GetPublicInfractions } from "../controllers/public.controller.js";
import Messages from "../messages.js";

const routes = Router()

// Rutas públicas (sin autenticación) para consulta ciudadana
routes.get("/search/plate/:plate", SearchByPlate, Messages)
routes.get("/search/identification/:identification", SearchByIdentification, Messages)
routes.get("/regulations", GetPublicInfractions, Messages);

export default routes
