import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/usuario', requireRole([ROLES.ADMIN]), async (req, res) => {
  const { tipo, data } = req.body;

  if (tipo === 'Crear') {
    await pool.query(`
      INSERT INTO usuario VALUES
      ($1,$2,$3,$4,$5,$6,false)
    `, Object.values(data));
  }

  if (tipo === 'Eliminar') {
    await pool.query(`
      UPDATE usuario SET usu_eliminado=true WHERE usu_rut=$1
    `, [data.rut]);
  }

  res.json({ ok: true });
});

export default router;
