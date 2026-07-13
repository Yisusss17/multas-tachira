// Backend/routes/infraction-data.routes.js (CREAR NUEVO ARCHIVO)
import { Router } from "express";
import database from "../database.js";
import { verifyToken } from "../auth.middleware.js";
import Messages from "../messages.js";

const routes = Router();

// Todas las rutas requieren autenticación
routes.use(verifyToken);

// ============================================
// 1. BÚSQUEDA DE PERSONAS
// ============================================
routes.get("/personas/cedula/:cedula", async (req, res, next) => {
  try {
    const { cedula } = req.params;
    console.log("🔍 Buscando persona con cédula:", cedula);
    
    const sql = `SELECT * FROM bd_personas WHERE persona_idn = $1`;
    const { rows } = await database.query(sql, [cedula]);
    
    if (rows.length === 0) {
      req.message = { type: "Not Found", message: "Persona no encontrada", status: 404 };
      return next();
    }
    
    console.log("✅ Persona encontrada:", rows[0].persona_idn);
    req.message = { type: "Successfully", message: rows[0], status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetPersonaByCedula:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 2. OBTENER INFRACTORES
// ============================================
routes.get("/infractores", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo infractores...");
    const sql = `SELECT * FROM bd_infracto`;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} infractores encontrados`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetInfractores:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 3. OBTENER VEHÍCULOS POR PERSONA
// ============================================
routes.get("/vehiculos/persona/:personaId", async (req, res, next) => {
  try {
    const { personaId } = req.params;
    console.log(`🔍 Buscando vehículos para persona ID: ${personaId}`);
    
    const sql = `
      SELECT v.*, t.tipo_veh_no 
      FROM bd_vehiculo v
      LEFT JOIN bd_tipo_veh t ON t.tipo_veh_pk = v.vehicul_tip
      WHERE v.vehicul_due = $1
    `;
    const { rows } = await database.query(sql, [personaId]);
    
    console.log(`✅ ${rows.length} vehículos encontrados`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetVehiculosByPersona:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 4. OBTENER CATEGORÍAS
// ============================================
routes.get("/categorias", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo categorías...");
    const sql = `SELECT * FROM bd_categori ORDER BY catego_nomb`;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} categorías encontradas`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetCategorias:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 5. OBTENER ARTÍCULOS
// ============================================
routes.get("/articulos", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo artículos...");
    const sql = `SELECT * FROM bd_articulo ORDER BY articul_num, articul_nrl`;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} artículos encontrados`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetArticulos:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 6. OBTENER NUMERALES (Artículos con formato)
// ============================================
routes.get("/numerales", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo numerales...");
    const sql = `
      SELECT 
        a.*,
        a.articul_prk as numeral_prk,
        a.articul_num as numeral_num,
        a.articul_nrl as numeral_nrl,
        a.articul_val as numeral_val,
        a.articul_des as numeral_des,
        a.articul_num || '-' || a.articul_nrl as numeral_completo
      FROM bd_articulo a 
      ORDER BY a.articul_num, a.articul_nrl
    `;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} numerales encontrados`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetNumerales:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 7. OBTENER RELACIONES ARTÍCULO-NUMERAL
// ============================================
routes.get("/articulo-numeral", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo relaciones artículo-numeral...");
    const sql = `
      SELECT 
        a.articul_prk as articulo_numeral_pk,
        a.articul_prk as articul_fk,
        a.articul_prk as numeral_fk
      FROM bd_articulo a
    `;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} relaciones encontradas`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetRelacionesArticuloNumeral:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 8. OBTENER TIPOS DE MULTA
// ============================================
routes.get("/tipos-multa", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo tipos de multa...");
    const sql = `SELECT * FROM bd_tipomult ORDER BY tipmult_nom`;
    const { rows } = await database.query(sql);
    console.log(`✅ ${rows.length} tipos de multa encontrados`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetTiposMulta:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 9. OBTENER FUNCIONARIO POR USUARIO
// ============================================
routes.get("/funcionarios/usuario/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Buscando funcionario para usuario ID: ${userId}`);
    
    // Verificar que el usuario existe
    const userCheck = await database.query(
      `SELECT usuario_prk FROM bd_usuarios WHERE usuario_prk = $1`,
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 };
      return next();
    }

    const sql = `
      SELECT 
        f.*,
        u.usuario_nom,
        u.usuario_ape,
        u.usuario_idn,
        r.rango_nombr,
        un.unidade_nom
      FROM bd_funciona f
      INNER JOIN bd_usuarios u ON u.usuario_prk = f.funciona_us
      INNER JOIN bd_rango_fu r ON r.rango_fu_pk = f.funciona_ra
      INNER JOIN bd_unidadep un ON un.unidade_prk = f.funciona_un
      WHERE f.funciona_us = $1
    `;
    
    const { rows } = await database.query(sql, [userId]);
    
    if (rows.length === 0) {
      req.message = { type: "Not Found", message: "Funcionario no encontrado para este usuario", status: 404 };
      return next();
    }
    
    console.log(`✅ Funcionario encontrado: ${rows[0].usuario_nom} ${rows[0].usuario_ape}`);
    req.message = { type: "Successfully", message: rows[0], status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetFuncionarioByUser:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 10. OBTENER ÚLTIMO NÚMERO DE BOLETA
// ============================================
routes.get("/multas/ultimo", async (req, res, next) => {
  try {
    console.log("🔍 Obteniendo última boleta...");
    const sql = `SELECT multaca_nro FROM bd_multacab ORDER BY multaca_prk DESC LIMIT 1`;
    const { rows } = await database.query(sql);
    console.log(`✅ Última boleta: ${rows.length > 0 ? rows[0].multaca_nro : 'Ninguna'}`);
    req.message = { type: "Successfully", message: rows, status: 200 };
    return next();
  } catch (err) {
    console.error("❌ Error en GetUltimoNumeroBoleta:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 11. CREAR MULTA
// ============================================
routes.post("/multas", async (req, res, next) => {
  try {
    console.log("📝 Creando nueva multa:", req.body);
    
    const {
      multaca_nro, multaca_fec, multaca_hor, multaca_lug,
      multaca_fun, multaca_ifr, multaca_veh, multaca_tip,
      multaca_mon, multaca_est, multaca_obs
    } = req.body;

    // Verificar que no exista una multa con el mismo número
    const checkSql = `SELECT multaca_prk FROM bd_multacab WHERE multaca_nro = $1`;
    const checkResult = await database.query(checkSql, [multaca_nro]);
    
    if (checkResult.rows.length > 0) {
      req.message = { 
        type: "Validation", 
        message: `Ya existe una multa con el número ${multaca_nro}`, 
        status: 400 
      };
      return next();
    }

    const sql = `
      INSERT INTO bd_multacab (
        multaca_nro, multaca_fec, multaca_hor, multaca_lug,
        multaca_fun, multaca_ifr, multaca_veh, multaca_tip,
        multaca_mon, multaca_est, multaca_obs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      multaca_nro, multaca_fec, multaca_hor, multaca_lug,
      multaca_fun, multaca_ifr, multaca_veh, multaca_tip,
      multaca_mon, multaca_est || 'Procesando', multaca_obs || ''
    ];

    const { rows } = await database.query(sql, values);
    console.log(`✅ Multa creada con ID: ${rows[0].multaca_prk}`);
    req.message = { type: "Successfully", message: rows[0], status: 201 };
    return next();
  } catch (err) {
    console.error("❌ Error en CreateMulta:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 12. CREAR DETALLE DE MULTA
// ============================================
routes.post("/multas/detalle", async (req, res, next) => {
  try {
    const { multa_de_mu, multa_de_ar, multa_de_mo } = req.body;
    console.log(`📝 Agregando detalle a multa ${multa_de_mu}: artículo ${multa_de_ar}`);

    const sql = `
      INSERT INTO bd_multa_de (multa_de_mu, multa_de_ar, multa_de_mo)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const { rows } = await database.query(sql, [multa_de_mu, multa_de_ar, multa_de_mo]);
    console.log(`✅ Detalle agregado`);
    req.message = { type: "Successfully", message: rows[0], status: 201 };
    return next();
  } catch (err) {
    console.error("❌ Error en CreateDetalleMulta:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

// ============================================
// 13. ASIGNAR CATEGORÍA A MULTA
// ============================================
routes.post("/multas/categoria", async (req, res, next) => {
  try {
    const { mlct_mul_fk, mlct_cat_fk } = req.body;
    console.log(`📝 Asignando categoría ${mlct_cat_fk} a multa ${mlct_mul_fk}`);

    const sql = `
      INSERT INTO bd_multacat (mlct_mul_fk, mlct_cat_fk)
      VALUES ($1, $2)
      RETURNING *
    `;

    const { rows } = await database.query(sql, [mlct_mul_fk, mlct_cat_fk]);
    console.log(`✅ Categoría asignada`);
    req.message = { type: "Successfully", message: rows[0], status: 201 };
    return next();
  } catch (err) {
    console.error("❌ Error en AsignarCategoria:", err);
    req.message = { type: "Error", message: err.message, status: 500 };
    return next();
  }
}, Messages);

export default routes;