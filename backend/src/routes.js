import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.get('/electivos', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT ele_cod, ele_nombre, ele_profesor FROM electivo WHERE ele_eliminado = false'
  );
  res.json(rows);
});

router.get('/postulaciones', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM postulacion WHERE post_eliminado = false'
  );
  res.json(rows);
});

export default router;
