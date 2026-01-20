import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { rut, contrasena } = req.body;

  const { rows } = await pool.query(`
    SELECT r.rol
    FROM usuario u
    JOIN rol r ON r.rol_id = u.usu_rol
    WHERE u.usu_rut = $1
    AND u.usu_contrasena = $2
    AND u.usu_eliminado = false
  `, [rut, contrasena]);

  if (rows.length === 0) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({ rol: rows[0].rol });
});

export default router;
