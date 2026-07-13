import database from "../database.js";

// ============================================
// OBTENER TODAS LAS INFRACCIONES (PÚBLICO)
// ============================================
export const GetPublicInfractions = async (req, res, next) => {
    try {
        const sql = `SELECT infraction_id, violation_description, ut_quantity 
                     FROM infractions 
                     ORDER BY ut_quantity DESC;`;
        const { rows } = await database.query(sql);
        
        req.message = {
            type: "Successfully",
            message: rows,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetPublicInfractions:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};