import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

// ============================
// PERIODOS (Uso de Secretaría)
// ============================
router.get('/periodos', async (req, res) => {
  try {
    // AHORA SÍ: Apuntamos a la tabla periodo_academico real
    const { rows } = await pool.query(`
      SELECT * FROM periodo_academico 
      WHERE per_eliminado = false 
      ORDER BY per_ano DESC, per_semestre DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener periodos' });
  }
});

// ============================
// BLOQUES HORARIOS
// ============================
router.get('/bloques', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bloque_horario ORDER BY blo_id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bloques' });
  }
});

// Obtener los bloques específicos de un electivo (Para el modo Editar)
router.get('/electivo/:cod/bloques', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT blo_id FROM electivo_horario WHERE ele_cod = $1', [req.params.cod]);
    res.json(rows.map(r => r.blo_id)); // Devolvemos un arreglo limpio de IDs: [1, 2]
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bloques del electivo' });
  }
});

router.get('/postulaciones', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.post_usuario as rut,
        u.usu_nombre as nombre,
        e.ele_nombre as electivo,
        e.ele_cod as id_electivo,
        p.post_pref as prioridad,
        e.ele_cupos as cupos_disponibles,
        s.est as estado
      FROM postulacion p
      JOIN usuario u ON p.post_usuario = u.usu_rut
      JOIN electivo e ON p.post_electivo = e.ele_cod
      JOIN estado s ON p.post_estado = s.est_id
      WHERE p.post_eliminado = false
      ORDER BY p.post_fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
});

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

router.post('/electivo', async (req, res) => {
  const { cod, periodo, nombre, descripcion, img, cupos_totales, profesor, bloques } = req.body;

  try {
    // 1. Verificamos si ya existe (aunque esté eliminado)
    const check = await pool.query('SELECT ele_eliminado FROM electivo WHERE ele_cod = $1', [cod]);

    if (check.rowCount > 0) {
      if (check.rows[0].ele_eliminado) {
        // CASO: Existe pero está en soft-delete -> LO REVIVIMOS
        await pool.query(`
          UPDATE electivo 
          SET ele_periodo=$2, ele_nombre=$3, ele_descripcion=$4, ele_img=$5, 
              ele_cupos_totales=$6, ele_cupos=$6, ele_profesor=$7, ele_eliminado=false
          WHERE ele_cod=$1
        `, [cod, periodo, nombre, descripcion, img, cupos_totales, profesor]);
      } else {
        // CASO: Existe y está activo -> ERROR DE DUPLICADO REAL
        return res.status(400).json({ error: 'Ese código de electivo ya está activo en el sistema.' });
      }
    } else {
      // CASO: No existe -> INSERT NORMAL
      await pool.query(`
        INSERT INTO electivo (ele_cod, ele_periodo, ele_nombre, ele_descripcion, ele_img, ele_cupos_totales, ele_cupos, ele_profesor)
        VALUES ($1,$2,$3,$4,$5,$6,$6,$7)
      `, [cod, periodo, nombre, descripcion, img, cupos_totales, profesor]);
    }

    // Manejo de bloques (igual que antes)
    await pool.query('DELETE FROM electivo_horario WHERE ele_cod=$1', [cod]);
    if (bloques && bloques.length > 0) {
      for (let blo_id of bloques) {
        await pool.query('INSERT INTO electivo_horario (ele_cod, blo_id) VALUES ($1, $2)', [cod, blo_id]);
      }
    }

    res.json({ ok: true, mensaje: 'Electivo creado/reactivado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al procesar el electivo' });
  }
});

router.put('/electivo/:cod', async (req,res)=>{
  const {cod} = req.params;
  const { nombre, descripcion, img, cupos_totales, profesor, bloques } = req.body;

  try {
    await pool.query(`
      UPDATE electivo SET ele_nombre=$1, ele_descripcion=$2, ele_img=$3, ele_cupos_totales=$4, ele_cupos=$4, ele_profesor=$5
      WHERE ele_cod=$6
    `,[nombre, descripcion, img, cupos_totales, profesor, cod]);

    // MAGIA: Borramos los horarios viejos y metemos los nuevos
    await pool.query('DELETE FROM electivo_horario WHERE ele_cod=$1', [cod]);
    if (bloques && bloques.length > 0) {
      for (let blo_id of bloques) {
        await pool.query('INSERT INTO electivo_horario (ele_cod, blo_id) VALUES ($1, $2)', [cod, blo_id]);
      }
    }
    res.json({ok:true});
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el electivo' });
  }
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
