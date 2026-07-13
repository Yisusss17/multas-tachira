// middlewares/role.middleware.js

// Middleware para verificar que el usuario tiene un rol específico
export const hasRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user viene del middleware verifyToken (auth.middleware.js)
       const userRole = req.user.role;
        
        console.log("🔍 Verificando rol - Usuario:", req.user.id, "Rol:", userRole)
        console.log("🔍 Roles permitidos:", allowedRoles)
        
        if (!userRole) {
            return res.status(403).json({
                type: "Error",
                message: "No se pudo determinar el rol del usuario"
            })
        }
        
        // Convertir a array si es un solo rol
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
        
        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (roles.includes(userRole)) {
            console.log("✅ Acceso permitido - Rol autorizado")
            next() // Continuar con el siguiente middleware/controlador
        } else {
            console.log("❌ Acceso denegado - Rol no autorizado")
            res.status(403).json({
                type: "Error",
                message: "No tiene permisos para acceder a este recurso"
            })
        }
    }
}

// Middleware para verificar permisos específicos (si usas permisos en JSON)
export const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        // req.user viene del middleware verifyToken
        const permissions = req.user.permissions
        
        console.log("🔍 Verificando permiso:", requiredPermission)
        
        if (!permissions) {
            return res.status(403).json({
                type: "Error",
                message: "No se encontraron permisos para el usuario"
            })
        }
        
        // Aquí puedes implementar lógica según cómo guardes los permisos
        // Por ejemplo, si permissions es un objeto:
        // if (permissions[requiredPermission]) { ... }
        
        // Por ahora, solo permitimos si tiene el permiso
        // Esto es un ejemplo - ajusta según tu estructura de permisos
        if (permissions && permissions.includes(requiredPermission)) {
            console.log("✅ Permiso autorizado")
            next()
        } else {
            console.log("❌ Permiso denegado")
            res.status(403).json({
                type: "Error",
                message: "No tiene permiso para realizar esta acción"
            })
        }
    }
}