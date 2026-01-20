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

export default router;
