import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/', requireRole([ROLES.ESTUDIANTE]), async (req, res) => {
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

export default router;
