import { Login } from "../modules/login.modules.js"
import { LoginValidated } from "../validates/login.validation.js"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const LoginControl = async (req, res, next) => {
    console.log(req.body);

    try {
        const { error, value } = LoginValidated.validate(req.body)

        console.log("ERROR:", error);
        console.log("VALUE:", value);
        if (error) {
            req.message = {
                type: "Validation",
                message: error.details[0].message,
                status: 400
            }
            return next();
        }

        const { results, data } = await Login(value.email)
        console.log("RESULTS:", results);
        console.log("DATA:", data);

        if (results === 0) {
            req.message = {
                type: "Not Found",
                message: "El usuario no existe",
                status: 400
            }
            return next()
        }

        const {
            password,
            id_user,
            role_nombre,
            first_name,
            last_name,
            identification,
            email,
            status,
            badge_code
        } = data

        const validPassword = await bcrypt.compare(
            value.password,
            password
        )
        console.log("PASSWORD BD:", password);
        console.log("PASSWORD ENVIADO:", value.password);
        console.log("VALID:", validPassword);

        if (!validPassword) {
            req.message = {
                type: "Error",
                message: "Credenciales incorrectas",
                status: 400
            }
            return next()
        }

        const payload = {
            id: id_user,
            role: role_nombre
        }

        const token = JWT.sign(
            payload,
            process.env.SECRET,
            {
                algorithm: "HS512",
                expiresIn: "1d"
            }
        )

        req.message = {
            type: "Successfully",
            message: {
                token,
                user: {
                    id: id_user,
                    role: role_nombre,
                    first_name,
                    last_name,
                    identification,
                    email,
                    status,
                    badge_code
                },
                text: "Login Correcto"
            },
            status: 200
        }

        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        }
        return next()
    }
}