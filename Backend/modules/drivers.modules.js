import database from "../database.js"

// Obtener todos los conductores
export const GetDrivers = async () => {
    const sql = `SELECT * FROM drivers ORDER BY id_driver;`
    const { rows } = await database.query(sql)
    return rows
}

// Obtener conductor por ID
export const GetDriverById = async (id) => {
    const sql = `SELECT * FROM drivers WHERE id_driver = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener conductor por cédula
export const GetDriverByIdentification = async (identification) => {
    const sql = `SELECT * FROM drivers WHERE identification = $1;`
    const { rows } = await database.query(sql, [identification])
    return rows[0]
}

// Crear nuevo conductor
export const CreateDriver = async (driver) => {
    const sql = `INSERT INTO drivers 
        (identification, first_name, last_name, address, phone, email, birth_date, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [
        driver.identification,
        driver.first_name,
        driver.last_name,
        driver.address,
        driver.phone,
        driver.email,
        driver.birth_date,
        driver.status || 'Active'
    ])
    return rows[0]
}

// Actualizar conductor
export const UpdateDriver = async (id, driver) => {
    const sql = `UPDATE drivers 
    SET first_name = $1, last_name = $2, address = $3, 
        phone = $4, email = $5, birth_date = $6, status = $7
    WHERE id_driver = $8 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [
        driver.first_name,
        driver.last_name,
        driver.address,
        driver.phone,
        driver.email,
        driver.birth_date,
        driver.status,
        id
    ])
    return rows[0]
}

// Eliminar conductor
export const DeleteDriver = async (id) => {
    const sql = `DELETE FROM drivers WHERE id_driver = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}