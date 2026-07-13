import {
    GetDashboardStats,
    GetTicketsByMonth,
    GetTicketsByStatus,
    GetTicketsByOfficer,
    GetTicketsByInfraction,
    GetRecentTickets
} from "../modules/dashboard.modules.js";

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================
export const GetStats = async (req, res, next) => {
    try {
        const stats = await GetDashboardStats();
        req.message = {
            type: "Successfully",
            message: stats,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetStats:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};

// ============================================
// MULTAS POR MES
// ============================================
export const GetTicketsByMonthCtrl = async (req, res, next) => {
    try {
        const data = await GetTicketsByMonth();
        req.message = {
            type: "Successfully",
            message: data,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetTicketsByMonthCtrl:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};

// ============================================
// MULTAS POR ESTADO
// ============================================
export const GetTicketsByStatusCtrl = async (req, res, next) => {
    try {
        const data = await GetTicketsByStatus();
        req.message = {
            type: "Successfully",
            message: data,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetTicketsByStatusCtrl:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};

// ============================================
// MULTAS POR OFICIAL
// ============================================
export const GetTicketsByOfficerCtrl = async (req, res, next) => {
    try {
        const data = await GetTicketsByOfficer();
        req.message = {
            type: "Successfully",
            message: data,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetTicketsByOfficerCtrl:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};

// ============================================
// MULTAS POR INFRACCIÓN
// ============================================
export const GetTicketsByInfractionCtrl = async (req, res, next) => {
    try {
        const data = await GetTicketsByInfraction();
        req.message = {
            type: "Successfully",
            message: data,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetTicketsByInfractionCtrl:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};

// ============================================
// ÚLTIMAS MULTAS
// ============================================
export const GetRecentTicketsCtrl = async (req, res, next) => {
    try {
        const data = await GetRecentTickets();
        req.message = {
            type: "Successfully",
            message: data,
            status: 200
        };
        return next();
    } catch (err) {
        console.error("❌ Error en GetRecentTicketsCtrl:", err);
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };
        return next();
    }
};