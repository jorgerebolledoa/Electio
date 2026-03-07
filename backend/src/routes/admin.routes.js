import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.use(requireRole([ROLES.ADMIN]));




// ============================
// USUARIO
// ============================

// Obtener todos los usuarios
router.get('/usuario', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT usu_rut, usu_nombre, usu_email, usu_nivel, usu_rol 
      FROM usuario 
      WHERE usu_eliminado = false
      ORDER BY usu_nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear usuario
router.post('/usuario', async (req, res) => {
  const { rut, contrasena, nombre, email, nivel, rol } = req.body;

  await pool.query(`
    INSERT INTO usuario
    (usu_rut, usu_contrasena, usu_nombre, usu_email, usu_nivel, usu_rol)
    VALUES ($1,$2,$3,$4,$5,$6)
  `,[rut, contrasena, nombre, email, nivel, rol]);

  res.json({ ok:true });
});


// Editar usuario
router.put('/usuario/:rut', async (req,res)=>{

  const {rut} = req.params;
  const {nombre,email,nivel,rol} = req.body;

  await pool.query(`
    UPDATE usuario
    SET
    usu_nombre=$1,
    usu_email=$2,
    usu_nivel=$3,
    usu_rol=$4
    WHERE usu_rut=$5
  `,[nombre,email,nivel,rol,rut]);

  res.json({ok:true});
});


// Soft delete usuario
router.delete('/usuario/:rut', async (req,res)=>{

  const {rut} = req.params;

  await pool.query(`
    UPDATE usuario
    SET usu_eliminado=true
    WHERE usu_rut=$1
  `,[rut]);

  res.json({ok:true});
});



// ============================
// PERIODO ACADEMICO
// ============================

// GET Periodos
router.get('/periodo', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM periodo_academico WHERE per_eliminado = false ORDER BY per_id ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener periodos' }); }
});

router.post('/periodo', async (req,res)=>{

  const {id, ano, semestre} = req.body;

  await pool.query(`
    INSERT INTO periodo_academico
    (per_id,per_ano,per_semestre)
    VALUES ($1,$2,$3)
  `,[id,ano,semestre]);

  res.json({ok:true});
});


router.put('/periodo/:id', async (req,res)=>{

  const {id} = req.params;
  const {ano, semestre} = req.body;

  await pool.query(`
    UPDATE periodo_academico
    SET per_ano=$1, per_semestre=$2
    WHERE per_id=$3
  `,[ano,semestre,id]);

  res.json({ok:true});
});


router.delete('/periodo/:id', async (req,res)=>{

  const {id} = req.params;

  await pool.query(`
    UPDATE periodo_academico
    SET per_eliminado=true
    WHERE per_id=$1
  `,[id]);

  res.json({ok:true});
});


// ============================
// ESTADO
// ============================

// GET Estados
router.get('/estado', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM estado ORDER BY est_id ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener estados' }); }
});

// Crear estado
router.post('/estado', async (req,res)=>{

  const {id, estado} = req.body;

  await pool.query(`
    INSERT INTO estado
    VALUES ($1,$2)
  `,[id,estado]);

  res.json({ok:true});
});


// Editar estado
router.put('/estado/:id', async (req,res)=>{

  const {id} = req.params;
  const {estado} = req.body;

  await pool.query(`
    UPDATE estado
    SET est=$1
    WHERE est_id=$2
  `,[estado,id]);

  res.json({ok:true});
});


// Eliminar estado
router.delete('/estado/:id', async (req,res)=>{

  const {id} = req.params;

  await pool.query(`
    DELETE FROM estado
    WHERE est_id=$1
  `,[id]);

  res.json({ok:true});
});

// ============================
// BLOQUE HORARIO
// ============================

// GET Bloques
router.get('/bloque', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bloque_horario ORDER BY blo_id ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener bloques' }); }
});

router.post('/bloque', async (req,res)=>{

  const {id,dia,hora_i,hora_t} = req.body;

  await pool.query(`
    INSERT INTO bloque_horario
    VALUES ($1,$2,$3,$4)
  `,[id,dia,hora_i,hora_t]);

  res.json({ok:true});
});


router.put('/bloque/:id', async (req,res)=>{

  const {id} = req.params;
  const {dia,hora_i,hora_t} = req.body;

  await pool.query(`
    UPDATE bloque_horario
    SET
    blo_dia=$1,
    blo_hora_i=$2,
    blo_hora_t=$3
    WHERE blo_id=$4
  `,[dia,hora_i,hora_t,id]);

  res.json({ok:true});
});


// no soft delete porque no existe campo eliminado
router.delete('/bloque/:id', async (req,res)=>{

  const {id} = req.params;

  await pool.query(`
    DELETE FROM bloque_horario
    WHERE blo_id=$1
  `,[id]);

  res.json({ok:true});
});
// ============================
// ROL
// ============================

// GET Roles
router.get('/rol', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM rol ORDER BY rol_id ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener roles' }); }
});

// Crear rol
router.post('/rol', async (req,res)=>{

  const {id, rol} = req.body;

  await pool.query(`
    INSERT INTO rol
    VALUES ($1,$2)
  `,[id,rol]);

  res.json({ok:true});
});


// Editar rol
router.put('/rol/:id', async (req,res)=>{

  const {id} = req.params;
  const {rol} = req.body;

  await pool.query(`
    UPDATE rol
    SET rol=$1
    WHERE rol_id=$2
  `,[rol,id]);

  res.json({ok:true});
});


// Eliminar rol
router.delete('/rol/:id', async (req,res)=>{

  const {id} = req.params;

  await pool.query(`
    DELETE FROM rol
    WHERE rol_id=$1
  `,[id]);

  res.json({ok:true});
});

export default router;