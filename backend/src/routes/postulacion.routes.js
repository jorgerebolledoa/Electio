import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/postular', requireRole([ROLES.ESTUDIANTE]), async (req, res) => {
  const { rut, ele_cod, prioridad } = req.body;

  const existe = await pool.query(`
    SELECT 1 FROM postulacion
    WHERE post_usuario = $1
    AND post_electivo = $2
    AND post_eliminado = false
  `, [rut, ele_cod]);

  if (existe.rowCount > 0) {
    return res.status(400).json({ error: 'Ya postulaste a este electivo' });
  }

  const { rows } = await pool.query(`
    INSERT INTO postulacion
    (post_usuario, post_electivo, post_pref, post_fecha, post_estado)
    VALUES ($1, $2, $3, NOW(), 1)
    RETURNING *
  `, [rut, ele_cod, prioridad]);

  res.json(rows[0]);
});


router.get('/:rut', async (req, res) => {
  const { rut } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT 
        p.post_id, 
        p.post_fecha, 
        p.post_fecha_asignacion,
        p.post_pref, 
        e.ele_nombre, 
        e.ele_cod, 
        s.est as estado 
      FROM postulacion p
      JOIN electivo e ON p.post_electivo = e.ele_cod
      JOIN estado s ON p.post_estado = s.est_id
      WHERE p.post_usuario = $1 AND p.post_eliminado = false
      ORDER BY p.post_pref ASC
    `, [rut]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las postulaciones' });
  }
});

export default router;
