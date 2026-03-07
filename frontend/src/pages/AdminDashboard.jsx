import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const AdminDashboard = () => {
  const [tablaActiva, setTablaActiva] = useState('usuarios');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({ rol: 1 });
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const nombresSingular = {
    usuarios: 'Usuario', periodos: 'Periodo', bloques: 'Bloque Horario', roles: 'Rol', estados: 'Estado'
  };

  const traductorColumnas = {
    usu_rut: 'RUT', usu_nombre: 'Nombre Completo', usu_email: 'Email', usu_nivel: 'Nivel', usu_rol: 'Rol ID',
    per_id: 'ID', per_ano: 'Año', per_semestre: 'Semestre', per_eliminado: 'Eliminado',
    blo_id: 'ID', blo_dia: 'Día', blo_hora_i: 'Inicio', blo_hora_t: 'Término',
    rol_id: 'ID Rol', rol: 'Nombre Rol',
    est_id: 'ID Estado', est: 'Nombre Estado'
  };

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    setDatos([]);
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };
      const rutas = { usuarios: 'usuario', periodos: 'periodo', bloques: 'bloque', roles: 'rol', estados: 'estado' };
      const respuesta = await axios.get(`http://localhost:3000/admin/${rutas[tablaActiva]}`, configuracion);
      setDatos(respuesta.data);
      setCargando(false);
    } catch (err) {
      setError('Error al cargar los datos.');
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [tablaActiva]);

  const abrirModalEdicion = (fila) => {
    setModoEdicion(true);
    
    if (tablaActiva === 'usuarios') {
      setIdEdicion(fila.usu_rut);
      setFormData({ rut: fila.usu_rut, nombre: fila.usu_nombre, email: fila.usu_email, nivel: fila.usu_nivel, rol: fila.usu_rol });
    } else if (tablaActiva === 'periodos') {
      setIdEdicion(fila.per_id);
      setFormData({ id: fila.per_id, ano: fila.per_ano, semestre: fila.per_semestre });
    } else if (tablaActiva === 'bloques') {
      setIdEdicion(fila.blo_id);
      setFormData({ id: fila.blo_id, dia: fila.blo_dia, hora_i: fila.blo_hora_i, hora_t: fila.blo_hora_t });
    } else if (tablaActiva === 'roles') {
      setIdEdicion(fila.rol_id);
      setFormData({ id: fila.rol_id, rol: fila.rol });
    } else if (tablaActiva === 'estados') {
      setIdEdicion(fila.est_id);
      setFormData({ id: fila.est_id, estado: fila.est });
    }
    
    setMostrarModal(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const rolToken = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rolToken } };
      const rutas = { usuarios: 'usuario', periodos: 'periodo', bloques: 'bloque', roles: 'rol', estados: 'estado' };

      const datosAEnviar = { ...formData };
      if (tablaActiva === 'usuarios') datosAEnviar.rol = parseInt(datosAEnviar.rol || 1);

      if (modoEdicion) {
        await axios.put(`http://localhost:3000/admin/${rutas[tablaActiva]}/${idEdicion}`, datosAEnviar, configuracion);
        alert('Registro actualizado exitosamente');
      } else {
        await axios.post(`http://localhost:3000/admin/${rutas[tablaActiva]}`, datosAEnviar, configuracion);
        alert('Registro creado exitosamente');
      }
      
      setMostrarModal(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar. Verifica los datos.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar registro?')) return;
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const rutas = { usuarios: 'usuario', periodos: 'periodo', bloques: 'bloque', roles: 'rol', estados: 'estado' };
      await axios.delete(`http://localhost:3000/admin/${rutas[tablaActiva]}/${id}`, { headers: { rol } });
      cargarDatos();
    } catch (err) { alert('Error al eliminar.'); }
  };

  return (
    <div>
      <Navbar tipo="privado" />
      
      <div className="main-container">
        
        <h1 className="curso-titulo">Panel de Administración</h1>

        
        <div className="admin-tabs">
          {Object.keys(nombresSingular).map((tabla) => (
            <button 
              key={tabla} 
              onClick={() => setTablaActiva(tabla)} 
              className={`tab-btn ${tablaActiva === tabla ? 'active' : ''}`}
            >
              {tabla}
            </button>
          ))}
        </div>

        
        <div className="admin-actions-bar">
          <button 
            className="btn-primario"
            onClick={() => { setModoEdicion(false); setFormData({ rol: 1 }); setMostrarModal(true); }} 
          >
            + Crear {nombresSingular[tablaActiva]}
          </button>
        </div>

        
        <div className="table-container">
          {cargando ? <p className="mensaje-estado">Cargando datos...</p> : 
           datos.length === 0 ? <p className="mensaje-vacio">No hay registros en esta tabla.</p> : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    {Object.keys(datos[0]).map(col => <th key={col}>{traductorColumnas[col] || col}</th>)}
                    <th className="th-acciones">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((fila, i) => {
                    const idFila = fila.usu_rut || fila.per_id || fila.blo_id || fila.rol_id || fila.est_id;
                    return (
                      <tr key={i}>
                        {Object.values(fila).map((val, j) => <td key={j}>{val?.toString()}</td>)}
                        <td className="td-acciones">
                          <button className="btn-editar" onClick={() => abrirModalEdicion(fila)}>Editar</button>
                          <button className="btn-eliminar" onClick={() => handleEliminar(idFila)}>Eliminar</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: '#4B5320', marginBottom: '20px' }}>
              {modoEdicion ? 'Editar' : 'Nuevo'} {nombresSingular[tablaActiva]}
            </h2>
            
            <form onSubmit={handleGuardar} className="admin-form">
              {tablaActiva === 'usuarios' && (
                <>
                  <label className="form-label">RUT:</label>
                  <input placeholder="Ej: 12345678-9" className="input-box" required disabled={modoEdicion} value={formData.rut || ''} onChange={e => setFormData({...formData, rut: e.target.value})} />
                  
                  <label className="form-label">Nombre Completo:</label>
                  <input placeholder="Nombre Completo" className="input-box" required value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  
                  <label className="form-label">Email:</label>
                  <input placeholder="correo@ejemplo.com" type="email" className="input-box" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                  
                  {!modoEdicion && (
                    <>
                      <label className="form-label">Contraseña Temporal:</label>
                      <input placeholder="Contraseña" type="password" className="input-box" required value={formData.contrasena || ''} onChange={e => setFormData({...formData, contrasena: e.target.value})} />
                    </>
                  )}
                  
                  <label className="form-label">Nivel (Semestres):</label>
                  <input placeholder="Ej: 5" type="number" className="input-box" required value={formData.nivel || ''} onChange={e => setFormData({...formData, nivel: e.target.value})} />
                  
                  <label className="form-label">Rol del Sistema:</label>
                  <select className="input-box select-box" value={formData.rol || 1} onChange={e => setFormData({...formData, rol: e.target.value})}>
                    <option value="1">Estudiante</option>
                    <option value="2">Secretaría</option>
                    <option value="3">Administrador</option>
                  </select>
                </>
              )}

              {tablaActiva === 'periodos' && (
                <>
                  <label className="form-label">ID Periodo:</label>
                  <input placeholder="ID" type="number" className="input-box" required disabled={modoEdicion} value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} />
                  <label className="form-label">Año:</label>
                  <input placeholder="Ej: 2026" className="input-box" required value={formData.ano || ''} onChange={e => setFormData({...formData, ano: e.target.value})} />
                  <label className="form-label">Semestre:</label>
                  <input placeholder="1 o 2" type="number" className="input-box" required value={formData.semestre || ''} onChange={e => setFormData({...formData, semestre: e.target.value})} />
                </>
              )}

              {tablaActiva === 'bloques' && (
                <>
                  <label className="form-label">ID Bloque:</label>
                  <input placeholder="ID" type="number" className="input-box" required disabled={modoEdicion} value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} />
                  <label className="form-label">Día:</label>
                  <input placeholder="Ej: Lunes" className="input-box" required value={formData.dia || ''} onChange={e => setFormData({...formData, dia: e.target.value})} />
                  <label className="form-label">Hora Inicio:</label>
                  <input placeholder="HH:MM" className="input-box" required value={formData.hora_i || ''} onChange={e => setFormData({...formData, hora_i: e.target.value})} />
                  <label className="form-label">Hora Fin:</label>
                  <input placeholder="HH:MM" className="input-box" required value={formData.hora_t || ''} onChange={e => setFormData({...formData, hora_t: e.target.value})} />
                </>
              )}

              {(tablaActiva === 'roles' || tablaActiva === 'estados') && (
                <>
                  <label className="form-label">ID:</label>
                  <input placeholder="ID" type="number" className="input-box" required disabled={modoEdicion} value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} />
                  <label className="form-label">Nombre:</label>
                  <input placeholder="Nombre" className="input-box" required value={formData[tablaActiva === 'roles' ? 'rol' : 'estado'] || ''} onChange={e => setFormData({...formData, [tablaActiva === 'roles' ? 'rol' : 'estado']: e.target.value})} />
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-confirmar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;