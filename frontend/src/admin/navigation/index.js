import adminNavData from "./nav-data-admin";
import officerNavData from "./nav-data-officer";

const normalizeRole = (role) => typeof role === "string" ? role.trim().toLowerCase() : "";

export function getNavigationByRole(role) {
    const normalizedRole = normalizeRole(role);

    if (
        normalizedRole === "administrative authority" ||
        normalizedRole === "administrador" ||
        normalizedRole === "admin" ||
        normalizedRole === "administrator"
    ) {
        return adminNavData;
    }

    return officerNavData;
}