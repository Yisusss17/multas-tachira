import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const pool = new pg.Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT_DB,
  database: process.env.DATABASE,
  host: process.env.HOST,
});

try {
  const res = await pool.query('SELECT plate, id_vehicle, id_driver, brand, model FROM vehicles ORDER BY id_vehicle LIMIT 20');
  console.log('count', res.rowCount);
  console.log(JSON.stringify(res.rows, null, 2));
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}
