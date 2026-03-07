import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const AdministrarElectivos = () => {
  const [electivos, setElectivos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [bloquesDisponibles, setBloquesDisponibles] = useState([]); // NUEVO ESTADO PARA BLOQUES
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [semestre, setSemestre] = useState(''); 
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  
  const [formData, setFormData] = useState({ bloques: [] }); // Aseguramos que inicie con array vacío

  // CARGAR PERIODOS Y BLOQUES HORARIOS INICIALES
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const rol = sessionStorage.getItem('rolUsuario');
        const config = { headers: { rol: rol } };
        
        // Cargar periodos
        const resPeriodos = await axios.get('http://localhost:3000/secretaria/periodos', config);
        setPeriodos(resPeriodos.data);
        if (resPeriodos.data.length > 0) {
          setSemestre(resPeriodos.data[0].per_id.toString());
        }

        // Cargar los bloques horarios disponibles
        const resBloques = await axios.get('http://localhost:3000/secretaria/bloques', config);
        setBloquesDisponibles(resBloques.data);

      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      }
    };
    cargarDatosIniciales();
  }, []);

  const cargarElectivos = async () => {
    if (!semestre) return;
    setCargando(true);
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };
      const respuesta = await axios.get(`http://localhost:3000/electivos/${semestre}`, configuracion);
      
      const listaOrdenada = respuesta.data.sort((a, b) => a.ele_cod.localeCompare(b.ele_cod));
      setElectivos(listaOrdenada);
      setCargando(false);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de electivos.');
      setCargando(false);
    }
  };

  useEffect(() => { cargarElectivos(); }, [semestre]);

  // ABRIR MODAL EDICIÓN
  const abrirModalEdicion = async (ele) => {
    setModoEdicion(true);
    setIdEdicion(ele.ele_cod);

    // Ir a buscar los bloques que tiene este electivo actualmente
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const config = { headers: { rol: rol } };
      const resBloques = await axios.get(`http://localhost:3000/secretaria/electivo/${ele.ele_cod}/bloques`, config);
      
      setFormData({
        cod: ele.ele_cod,
        periodo: ele.ele_periodo || semestre, 
        nombre: ele.ele_nombre,
        descripcion: ele.ele_descripcion || '',
        img: ele.ele_img || '',
        cupos_totales: ele.ele_cupos_totales || ele.ele_cupos || '', 
        profesor: ele.ele_profesor || '',
        bloques: resBloques.data || [] // Metemos los IDs de los bloques encontrados
      });
      setMostrarModal(true);
    } catch (error) {
      alert("Error cargando los bloques del electivo");
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormData({ periodo: semestre, bloques: [] });
    setMostrarModal(true);
  };

  // MANEJO DEL CHECKBOX DE HORARIOS
  const handleCheckboxChange = (blo_id) => {
    setFormData((prev) => {
      const bloquesActuales = prev.bloques || [];
      // Si ya lo tiene, lo quitamos. Si no lo tiene, lo agregamos.
      if (bloquesActuales.includes(blo_id)) {
        return { ...prev, bloques: bloquesActuales.filter(id => id !== blo_id) };
      } else {
        return { ...prev, bloques: [...bloquesActuales, blo_id] };
      }
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (formData.bloques.length === 0) {
      alert("Por favor, selecciona al menos un bloque horario.");
      return;
    }

    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };

      if (modoEdicion) {
        await axios.put(`http://localhost:3000/secretaria/electivo/${idEdicion}`, formData, configuracion);
        alert('Electivo actualizado correctamente');
      } else {
        await axios.post('http://localhost:3000/secretaria/electivo', formData, configuracion);
        alert('Electivo creado correctamente');
      }
      
      setMostrarModal(false);
      cargarElectivos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar. Verifica los datos.');
    }
  };

  const handleEliminar = async (codigo) => {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar el electivo ${codigo}?`);
    if (!confirmar) return;
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };
      await axios.delete(`http://localhost:3000/secretaria/electivo/${codigo}`, configuracion);
      cargarElectivos();
    } catch (err) {
      alert('Error al eliminar el electivo');
    }
  };

  return (
    <div>
      <Navbar tipo="privado" />
      
      <div className="main-container">
        <div className="secretaria-top-header">
          <div className="secretaria-stats">
             <h1 className="curso-titulo mb-0">Administrar Electivos</h1>
          </div>
          <div className="secretaria-actions">
            <select className="select-semestre" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
              {periodos.map(p => (
                <option key={p.per_id} value={p.per_id}>
                  {p.per_semestre === 1 ? 'Primer' : 'Segundo'} Semestre {p.per_ano}
                </option>
              ))}
            </select>
            <button className="btn-volver mb-0" onClick={() => navigate('/secretaria')}>
              ← Volver al Panel
            </button>
          </div>
        </div>

        <div className="admin-actions-bar">
          <button className="btn-primario" onClick={abrirModalCrear}>+ Crear Nuevo Electivo</button>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        <div className="table-responsive">
          {cargando ? (
            <p className="mensaje-estado">Cargando catálogo...</p>
          ) : electivos.length === 0 ? (
            <table className="secretaria-table"><tbody><tr><td className="td-mensaje">No hay electivos.</td></tr></tbody></table>
          ) : (
            <table className="secretaria-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Profesor</th>
                  <th className="text-center">Cupos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {electivos.map((ele) => (
                  <tr key={ele.ele_cod}>
                    <td className="fw-800">{ele.ele_cod}</td>
                    <td className="fw-800">{ele.ele_nombre}</td>
                    <td>{ele.ele_profesor || 'Por asignar'}</td>
                    <td className="text-center fw-800">{ele.ele_cupos_totales || ele.ele_cupos || '0'}</td>
                    <td className="td-acciones">
                      <button className="btn-editar" onClick={() => abrirModalEdicion(ele)}>Editar</button>
                      <button className="btn-eliminar" onClick={() => handleEliminar(ele.ele_cod)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="modal-titulo">{modoEdicion ? 'Editar Electivo' : 'Nuevo Electivo'}</h2>
            
            <form onSubmit={handleGuardar} className="admin-form">
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label mt-0">Código:</label>
                  <input placeholder="Ej: INF-500" className="input-box" required disabled={modoEdicion} value={formData.cod || ''} onChange={e => setFormData({...formData, cod: e.target.value})} />
                </div>
                <div className="form-col">
                  <label className="form-label mt-0">ID Periodo:</label>
                  <input type="number" className="input-box" required disabled value={formData.periodo || ''} />
                </div>
              </div>

              <label className="form-label">Nombre del Electivo:</label>
              <input placeholder="Nombre" className="input-box" required value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} />

              <label className="form-label">Profesor:</label>
              <input placeholder="Nombre del Profesor" className="input-box" required value={formData.profesor || ''} onChange={e => setFormData({...formData, profesor: e.target.value})} />

              
              <label className="form-label">Bloques Horarios (Selecciona uno o más):</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F4F3ED', padding: '10px', borderRadius: '5px', border: '1px solid #CCC' }}>
                {bloquesDisponibles.map(b => (
                  <label key={b.blo_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(formData.bloques || []).includes(b.blo_id)}
                      onChange={() => handleCheckboxChange(b.blo_id)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    {b.blo_dia} ({b.blo_hora_i.slice(0,5)} - {b.blo_hora_t.slice(0,5)})
                  </label>
                ))}
              </div>

              <div className="form-row mt-0">
                <div className="form-col">
                  <label className="form-label">Cupos Totales:</label>
                  <input type="number" placeholder="Ej: 30" className="input-box" required value={formData.cupos_totales || ''} onChange={e => setFormData({...formData, cupos_totales: e.target.value})} />
                </div>
                <div className="form-col-2">
                  <label className="form-label">URL Imagen (Opcional):</label>
                  <input placeholder="http://..." className="input-box" value={formData.img || ''} onChange={e => setFormData({...formData, img: e.target.value})} />
                </div>
              </div>

              <label className="form-label">Descripción:</label>
              <textarea 
                placeholder="Breve descripción del curso..." className="input-box textarea-fixed" rows="2" 
                value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />

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

export default AdministrarElectivos;