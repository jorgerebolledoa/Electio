import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// ============================
// 1. OBTENER TODOS LOS PERIODOS
// ============================
router.get('/periodos/todos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM periodo_academico 
      WHERE per_eliminado = false 
      ORDER BY per_ano DESC, per_semestre DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los periodos públicos' });
  }
});

// ============================
// 2. OBTENER DETALLE DE UN SOLO ELECTIVO (Y SUS HORARIOS)
// ============================
router.get('/curso/:cod', async (req, res) => {
  const { cod } = req.params;

  try {
    // 1. Buscamos los datos básicos del ramo
    const electivoRes = await pool.query(`
      SELECT * FROM electivo 
      WHERE ele_cod = $1 AND ele_eliminado = false
    `, [cod]);

    if (electivoRes.rows.length === 0) {
      return res.status(404).json({ error: 'Electivo no encontrado' });
    }

    const electivo = electivoRes.rows[0];

    // 2. Buscamos TODOS sus horarios asociados
    const horarioRes = await pool.query(`
      SELECT b.blo_dia, b.blo_hora_i, b.blo_hora_t
      FROM electivo_horario eh
      JOIN bloque_horario b ON b.blo_id = eh.blo_id
      WHERE eh.ele_cod = $1
    `, [cod]);

    // 3. Metemos los horarios dentro del objeto del electivo
    electivo.horarios = horarioRes.rows;

    res.json(electivo); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el detalle' });
  }
});

// ============================
// 3. OBTENER CATÁLOGO POR PERIODO (¡Sin el JOIN que duplicaba!)
// ============================
router.get('/:periodo', async (req, res) => {
  const { periodo } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT ele_cod, ele_nombre, ele_cupos, ele_cupos_totales,
             ele_profesor, ele_img, ele_descripcion
      FROM electivo 
      WHERE ele_periodo = $1 AND ele_eliminado = false
    `, [periodo]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener electivos' });
  }
});

export default router;