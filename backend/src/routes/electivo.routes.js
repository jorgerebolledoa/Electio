import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/:periodo', async (req, res) => {
  const { periodo } = req.params;

  const { rows } = await pool.query(`
    SELECT e.ele_cod, e.ele_nombre, e.ele_cupos,
           e.ele_profesor, e.ele_img, e.ele_descripcion,
           b.blo_dia
    FROM electivo e
    LEFT JOIN electivo_horario eh ON eh.ele_cod = e.ele_cod
    LEFT JOIN bloque_horario b ON b.blo_id = eh.blo_id
    WHERE e.ele_periodo = $1
    AND e.ele_eliminado = false
  `, [periodo]);

  res.json(rows);
});


export default router;
