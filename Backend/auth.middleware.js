import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({
            type: "Error",
            message: "Acceso denegado. Token no proporcionado."
        })
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET)
            console.log(verified)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({
            type: "Error",
            message: "Token inválido"
        })
    }
}