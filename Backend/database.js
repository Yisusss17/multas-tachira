import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

// Detectamos si el sistema está corriendo en internet (Render)
const isProduction = process.env.NODE_ENV === 'production'

// Configuramos los accesos dependiendo del entorno
const config = isProduction 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Obligatorio para servidores en la nube
    }
  : {
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.PORT_DB,
      database: process.env.DATABASE,
      host: process.env.HOST,
    };

const database = new Pool(config)

export default database