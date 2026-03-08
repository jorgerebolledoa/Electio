import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; 
import '../App.css';

const SecretariaDashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const navigate = useNavigate();

  const cargarPostulaciones = async () => {
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };
      
      const respuesta = await axios.get('http://localhost:3000/secretaria/postulaciones', configuracion);
      setSolicitudes(respuesta.data);
      setCargando(false);
    } catch (err) {
      console.error("Error cargando postulaciones:", err);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const handleOperacion = async (rut, ele_cod, accion) => {
    try {
      const rol = sessionStorage.getItem('rolUsuario');
      const configuracion = { headers: { rol: rol } };
      
      const body = {
        rut: rut,
        ele_cod: ele_cod,
        accion: accion
      };

      await axios.post('http://localhost:3000/secretaria/resolver', body, configuracion);
      cargarPostulaciones();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al procesar la solicitud');
    }
  };

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente' || s.estado === 'pendiente').length;
  const totales = solicitudes.length;

  return (
    <div>
      <Navbar tipo="privado" />

      <div className="main-container">
        <div className="secretaria-top-header">
          <div className="secretaria-stats">
            <div className="stat-item">
              <span className="stat-num stat-dark">{pendientes}</span>
              <span className="stat-text">Postulaciones pendientes</span>
            </div>
            <div className="stat-line"></div>
            <div className="stat-item">
              <span className="stat-num stat-light">{totales}</span>
              <span className="stat-text">Postulaciones Totales</span>
            </div>
          </div>
          <div className="secretaria-actions">
            <button 
              className="btn-primario" 
              onClick={() => navigate('/secretaria/electivos')}
              style={{ marginBottom: 0 }} 
            >
              Administrar Electivos
            </button>

            <button 
              className="btn-primario"
              onClick={() => navigate('/secretaria/inscritos')}
            >
              Lista de Inscritos
            </button>
          </div>

        </div>
        <div className="table-responsive">
          <table className="secretaria-table">
            <thead>
              <tr>
                <th>Rut</th>
                <th>Nombre</th>
                <th>Electivo</th>
                <th style={{ textAlign: 'center' }}>Prioridad</th>
                <th style={{ textAlign: 'center' }}>Cupo disponible</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="7" className="td-mensaje">Cargando datos...</td>
                </tr>
              ) : solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="td-mensaje">No hay postulaciones registradas.</td>
                </tr>
              ) : (
                solicitudes.map((row, index) => {
                  const estadoMinuscula = row.estado?.toLowerCase();
                  const esPendiente = estadoMinuscula === 'pendiente';
                  const esAceptado = estadoMinuscula === 'aceptada' || estadoMinuscula === 'aceptado';
                  const esRechazado = estadoMinuscula === 'rechazada' || estadoMinuscula === 'rechazado';

                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: '800' }}>{row.rut}</td>
                      <td style={{ fontWeight: '800' }}>{row.nombre}</td>
                      <td>{row.electivo}</td>
                      <td style={{ textAlign: 'center', fontWeight: '800' }}>{row.prioridad}</td>
                      <td style={{ textAlign: 'center', fontWeight: '800' }}>{row.cupos_disponibles || row.cupo}</td>
                      <td className="td-accion-btn">
                        {esPendiente ? (
                          <button 
                            className="btn-tabla-aceptar"
                            onClick={() => handleOperacion(row.rut, row.id_electivo || row.ele_cod, 'Aceptar')}
                          >
                            Aceptar
                          </button>
                        ) : esAceptado ? (
                          <span className="texto-estado-final">Aceptado</span>
                        ) : null}
                      </td>
                      
                      <td className="td-accion-btn">
                        {esPendiente ? (
                          <button 
                            className="btn-tabla-rechazar"
                            onClick={() => handleOperacion(row.rut, row.id_electivo || row.ele_cod, 'Rechazar')}
                          >
                            Rechazar
                          </button>
                        ) : esRechazado ? (
                          <span className="texto-estado-final">Rechazado</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SecretariaDashboard;