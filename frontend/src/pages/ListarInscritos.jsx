import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const ListarInscritos = () => {
  const [electivos, setElectivos] = useState([]);
  const [electivoSeleccionado, setElectivoSeleccionado] = useState('');
  const [inscritos, setInscritos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Cargar los electivos para llenar el menú desplegable
  useEffect(() => {
    const cargarElectivos = async () => {
      try {
        const rol = sessionStorage.getItem('rolUsuario');
        const configuracion = { headers: { rol: rol } };
        const respuesta = await axios.get('http://localhost:3000/electivos/1', configuracion);
        setElectivos(respuesta.data);
        
        if (respuesta.data.length > 0) {
          setElectivoSeleccionado(respuesta.data[0].ele_cod);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar la lista de electivos.');
      }
    };
    cargarElectivos();
  }, []);

  // 2. Cargar alumnos cuando cambia el ramo
  useEffect(() => {
    const cargarInscritos = async () => {
      if (!electivoSeleccionado) return;
      
      setCargando(true);
      try {
        const rol = sessionStorage.getItem('rolUsuario');
        const configuracion = { headers: { rol: rol } };
        
        const respuesta = await axios.get(`http://localhost:3000/secretaria/inscritos/${electivoSeleccionado}`, configuracion);
        setInscritos(respuesta.data);
        setCargando(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los alumnos inscritos.');
        setCargando(false);
      }
    };
    
    cargarInscritos();
  }, [electivoSeleccionado]); 

  return (
    <div>
      <Navbar tipo="privado" />
      
      <div className="main-container">
        
        
        <div className="secretaria-top-header">
          <h1 className="curso-titulo" style={{ marginBottom: 0 }}>Lista de Inscritos Oficial</h1>
          <button 
            className="btn-volver" 
            onClick={() => navigate('/secretaria')} 
            style={{ marginBottom: 0 }} 
          >
            ← Volver al Panel
          </button>
        </div>

        
        <div className="filtro-inscritos-container">
          <label className="form-label" style={{ marginTop: 0 }}>Seleccionar Electivo:</label>
          <select 
            className="select-semestre" 
            value={electivoSeleccionado} 
            onChange={(e) => setElectivoSeleccionado(e.target.value)}
            style={{ minWidth: '350px' }}
          >
            {electivos.map(e => (
              <option key={e.ele_cod} value={e.ele_cod}>
                {e.ele_nombre} ({e.ele_cod})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        
        <div className="table-responsive">
          {cargando ? (
            <p className="mensaje-estado">Buscando alumnos aceptados...</p>
          ) : (
            <table className="secretaria-table">
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre Alumno</th>
                  <th>Email Institucional</th>
                  <th>Fecha de Asignación</th>
                </tr>
              </thead>
              <tbody>
                {inscritos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="td-mensaje">
                      No hay alumnos matriculados oficialmente en este electivo.
                    </td>
                  </tr>
                ) : (
                  inscritos.map((alum, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '800' }}>{alum.usu_rut}</td>
                      <td style={{ fontWeight: '800' }}>{alum.usu_nombre}</td>
                      <td>{alum.usu_email}</td>
                      <td style={{ fontWeight: '600' }}>
                        {new Date(alum.post_fecha_asignacion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default ListarInscritos;