import database from "../database.js"

// Obtener todos los vehículos
export const GetVehicles = async () => {
    const sql = `SELECT v.*, 
                    vt.name as vehicle_type_name,
                    CONCAT(d.first_name, ' ', d.last_name) as owner_name
                 FROM vehicles v
                 LEFT JOIN vehicle_types vt ON v.id_vehicle_type = vt.id_vehicle_type
                 LEFT JOIN drivers d ON v.id_driver = d.id_driver
                 ORDER BY v.id_vehicle;`
    const { rows } = await database.query(sql)
    return rows
}

// Obtener vehículo por ID
export const GetVehicleById = async (id) => {
    const sql = `SELECT v.*, 
                    vt.name as vehicle_type_name,
                    CONCAT(d.first_name, ' ', d.last_name) as owner_name
                 FROM vehicles v
                 LEFT JOIN vehicle_types vt ON v.id_vehicle_type = vt.id_vehicle_type
                 LEFT JOIN drivers d ON v.id_driver = d.id_driver
                 WHERE v.id_vehicle = $1;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}

// Obtener vehículo por placa
export const GetVehicleByPlate = async (plate) => {
    const sql = `SELECT v.*, 
                    vt.name as vehicle_type_name,
                    CONCAT(d.first_name, ' ', d.last_name) as owner_name,
                    d.first_name as owner_first_name,
                    d.last_name as owner_last_name,
                    d.identification as owner_identification,
                    d.phone as owner_phone,
                    d.email as owner_email,
                    d.address as owner_address
                 FROM vehicles v
                 LEFT JOIN vehicle_types vt ON v.id_vehicle_type = vt.id_vehicle_type
                 LEFT JOIN drivers d ON v.id_driver = d.id_driver
                 WHERE regexp_replace(lower(trim(v.plate)), '[^a-z0-9]+', '', 'g') = regexp_replace(lower(trim($1)), '[^a-z0-9]+', '', 'g');`
    const { rows } = await database.query(sql, [plate])
    return rows[0]
}

// Obtener vehículos por conductor
export const GetVehiclesByDriver = async (driverId) => {
    const sql = `SELECT v.*, vt.name as vehicle_type_name
                 FROM vehicles v
                 LEFT JOIN vehicle_types vt ON v.id_vehicle_type = vt.id_vehicle_type
                 WHERE v.id_driver = $1
                 ORDER BY v.id_vehicle;`
    const { rows } = await database.query(sql, [driverId])
    return rows
}

// Crear nuevo vehículo
export const CreateVehicle = async (vehicle) => {
    const sql = `INSERT INTO vehicles 
        (plate, id_driver, id_vehicle_type, brand, model, year, color, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [
        vehicle.plate,
        vehicle.id_driver,
        vehicle.id_vehicle_type,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.color,
        vehicle.status || 'Active'
    ])
    return rows[0]
}

// Actualizar vehículo
export const UpdateVehicle = async (id, vehicle) => {
    const sql = `UPDATE vehicles 
    SET plate = $1, id_driver = $2, id_vehicle_type = $3, 
        brand = $4, model = $5, year = $6, color = $7, status = $8
    WHERE id_vehicle = $9 
    RETURNING *;`
    
    const { rows } = await database.query(sql, [
        vehicle.plate,
        vehicle.id_driver,
        vehicle.id_vehicle_type,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.color,
        vehicle.status,
        id
    ])
    return rows[0]
}

// Eliminar vehículo
export const DeleteVehicle = async (id) => {
    const sql = `DELETE FROM vehicles WHERE id_vehicle = $1 RETURNING *;`
    const { rows } = await database.query(sql, [id])
    return rows[0]
}