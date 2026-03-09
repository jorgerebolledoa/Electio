import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { rut, contrasena } = req.body;

  console.log("rut:", rut);
  console.log("pass:", contrasena);

  const { rows } = await pool.query(`
    SELECT u.*, 
           (SELECT rol 
            FROM rol 
            WHERE rol_id = u.usu_rol) AS rol
    FROM usuario u
    WHERE u.usu_rut = $1
  `, [rut]);

  console.log("usuario:", rows);

  if (rows.length === 0) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({ rol: rows[0].rol });
});

export default router;