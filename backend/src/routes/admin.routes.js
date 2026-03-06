import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.use(requireRole([ROLES.ADMIN]));


// ============================
// USUARIO
// ============================

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
// ELECTIVO
// ============================

router.post('/electivo', async (req,res)=>{

  const {
    cod,
    periodo,
    nombre,
    descripcion,
    img,
    cupos_totales,
    profesor
  } = req.body;

  await pool.query(`
    INSERT INTO electivo
    (
      ele_cod,
      ele_periodo,
      ele_nombre,
      ele_descripcion,
      ele_img,
      ele_cupos_totales,
      ele_cupos,
      ele_profesor
    )
    VALUES ($1,$2,$3,$4,$5,$6,$6,$7)
  `,[cod,periodo,nombre,descripcion,img,cupos_totales,profesor]);

  res.json({ok:true});
});


router.put('/electivo/:cod', async (req,res)=>{

  const {cod} = req.params;

  const {
    nombre,
    descripcion,
    cupos_totales,
    profesor
  } = req.body;

  await pool.query(`
    UPDATE electivo
    SET
    ele_nombre=$1,
    ele_descripcion=$2,
    ele_cupos_totales=$3,
    ele_profesor=$4
    WHERE ele_cod=$5
  `,[nombre,descripcion,cupos_totales,profesor,cod]);

  res.json({ok:true});
});


router.delete('/electivo/:cod', async (req,res)=>{

  const {cod} = req.params;

  await pool.query(`
    UPDATE electivo
    SET ele_eliminado=true
    WHERE ele_cod=$1
  `,[cod]);

  res.json({ok:true});
});



// ============================
// BLOQUE HORARIO
// ============================

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

export default router;