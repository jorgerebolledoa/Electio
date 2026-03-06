import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/resolver', requireRole([ROLES.SECRETARIA]), async (req, res) => {
  const { rut, ele_cod, accion } = req.body;

  if (accion === 'Aceptar') {
    const cupos = await pool.query(
      'SELECT ele_cupos FROM electivo WHERE ele_cod=$1', [ele_cod]
    );

    if (cupos.rows[0].ele_cupos <= 0) {
      return res.status(400).json({ error: 'Sin cupos disponibles' });
    }

    await pool.query(
      'UPDATE electivo SET ele_cupos = ele_cupos - 1 WHERE ele_cod=$1',
      [ele_cod]
    );

    await pool.query(`
      UPDATE postulacion
      SET post_estado = 2, post_fecha_asignacion = NOW()
      WHERE post_usuario=$1 AND post_electivo=$2
    `, [rut, ele_cod]);
  }

  if (accion === 'Rechazar') {
    await pool.query(`
      UPDATE postulacion
      SET post_estado = 3, post_fecha_asignacion = NOW()
      WHERE post_usuario=$1 AND post_electivo=$2
    `, [rut, ele_cod]);
  }

  res.json({ ok: true });
});

router.get('/inscritos/:electivo', requireRole([ROLES.SECRETARIA]), async (req, res) => {
  const { electivo } = req.params;

  const { rows } = await pool.query(`
    SELECT u.usu_rut, u.usu_nombre, u.usu_email, p.post_fecha_asignacion
    FROM postulacion p
    JOIN usuario u ON u.usu_rut = p.post_usuario
    JOIN estado e ON e.est_id = p.post_estado
    WHERE p.post_electivo = $1
    AND e.est = 'Aceptada'
  `, [electivo]);

  res.json(rows);
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



export default router;
