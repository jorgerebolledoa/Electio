import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const DetalleElectivo = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [electivo, setElectivo] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [prioridad, setPrioridad] = useState(1);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        // AHORA LLAMA A LA NUEVA RUTA DEL BACKEND
        const respuesta = await axios.get(`http://localhost:3000/electivos/curso/${id}`); 
        
        // Ya no necesitamos usar el .find() porque el backend nos devuelve el curso exacto
        setElectivo(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error cargando detalle:", error);
        setElectivo(null); // Aseguramos que quede nulo si hay error (ej: error 404)
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  const handleBotonPostular = () => {
    const rol = sessionStorage.getItem('rolUsuario');
    if (!rol || rol === 'null' || rol === 'undefined' || rol.trim() === '') {
      navigate('/login');
      return; 
    }
    setMostrarModal(true);
  };

  const confirmarPostulacion = async () => {
    try {
      const rut = sessionStorage.getItem('rutUsuario');
      const rol = sessionStorage.getItem('rolUsuario');
      
      await axios.post('http://localhost:3000/postulaciones/postular', {
        rut: rut,
        ele_cod: id,
        prioridad: parseInt(prioridad)
      }, { headers: { rol: rol } });
      
      alert('¡Postulación enviada con éxito!');
      setMostrarModal(false);
      navigate('/estudiante'); 
    } catch (error) {
      alert(error.response?.data?.error || 'Error al procesar la postulación.');
    }
  };

  if (cargando) return <div className="main-container"><p>Cargando información del electivo...</p></div>;
  if (!electivo) return <div className="main-container"><p>Electivo no encontrado.</p></div>;

  const tieneSesion = sessionStorage.getItem('rolUsuario') && sessionStorage.getItem('rolUsuario') !== 'null';

  return (
    <div>
      <Navbar tipo={tieneSesion ? "privado" : "publico"} />
      
      <div className="main-container detalle-page">
        
        <button className="btn-volver" onClick={() => navigate(-1)}>
          Volver
        </button>

        <h1 className="curso-titulo">{electivo.ele_nombre}</h1>

        <div className="detalle-layout">
          <div className="col-left">
            <div 
              className="detalle-image" 
              style={{ 
                backgroundImage: `url('${electivo.ele_img || `https://picsum.photos/seed/${id}/500/300`}')`,
                backgroundColor: '#A5A58D' 
              }}
            ></div>
            
            <h2 className="seccion-titulo">Horario</h2>
            <table className="horario-table">
              <tbody>
                {electivo.horarios && electivo.horarios.length > 0 ? (
                  electivo.horarios.map((h, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 'bold' }}>{h.blo_dia}</td>
                      <td>{h.blo_hora_i.slice(0, 5)} - {h.blo_hora_t.slice(0, 5)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ fontStyle: 'italic', color: '#666' }}>
                      Horario por asignar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="col-right">
            <h2 className="seccion-titulo">Acerca del electivo</h2>
            <p className="curso-descripcion">
              {electivo.ele_descripcion || 'Asignatura orientada al estudio de los principios matemáticos y computacionales que sustentan la seguridad de la información.'}
            </p>
            
            <p className="profesor-texto">
              <strong>Profesor:</strong> {electivo.ele_profesor || 'Por asignar'}
            </p>

            <h2 className="seccion-titulo">Cupos</h2>
            <div className="cupos-info">
              <p>Cupos disponibles : <strong>{electivo.ele_cupos}</strong></p>
              <p>Cupos totales : <strong>{electivo.ele_cupos_totales || electivo.ele_cupos}</strong></p>
            </div>

            <button 
              className="btn-postular-grande"
              onClick={handleBotonPostular}
              disabled={electivo.ele_cupos === 0}
            >
              {electivo.ele_cupos === 0 ? 'SIN CUPOS' : 'Postular'}
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: '#4B5320', marginBottom: '15px' }}>Confirmar Postulación</h2>
            <p>Estás a punto de postular a <strong>{electivo.ele_nombre}</strong>.</p>
            <div style={{ margin: '20px 0', textAlign: 'left' }}>
              <label style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#1A1A1A' }}>Prioridad:</label>
              <select className="select-prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                <option value="1">Prioridad 1 (Muy Alta)</option>
                <option value="2">Prioridad 2 (Alta)</option>
                <option value="3">Prioridad 3 (Media)</option>
                <option value="4">Prioridad 4 (Baja)</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn-confirmar" onClick={confirmarPostulacion}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleElectivo;