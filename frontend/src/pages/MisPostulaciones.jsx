import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPostulaciones = async () => {
      try {
        const rut = sessionStorage.getItem('rutUsuario');
        const rol = sessionStorage.getItem('rolUsuario');

        if (!rut) {
          setError('No se encontró el RUT. Por favor, vuelve a iniciar sesión.');
          setCargando(false);
          return;
        }

        const configuracion = { headers: { rol: rol } };
        const respuesta = await axios.get(`http://localhost:3000/postulaciones/${rut}`, configuracion);
        
        setPostulaciones(respuesta.data);
        setCargando(false);
      } catch (err) {
        console.error("Error trayendo postulaciones:", err);
        setError('No tienes postulaciones o hubo un error al cargar.');
        setCargando(false);
      }
    };

    cargarPostulaciones();
  }, []);

  const tieneSesion = sessionStorage.getItem('rolUsuario') && sessionStorage.getItem('rolUsuario') !== 'null';

  return (
    <div>
      <Navbar tipo={tieneSesion ? "privado" : "publico"} />
      
      <div className="main-container">
        
        
        <div className="postulaciones-topbar">
          <button className="btn-volver" onClick={() => navigate('/estudiante')}>
            ← Volver a Electivos
          </button>
          <h1 className="curso-titulo" style={{ marginBottom: '2rem' }}>Mis Postulaciones</h1>
        </div>

        {cargando && <p className="mensaje-estado">Cargando tus postulaciones...</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && (
          <div className="electivos-lista">
            
            {postulaciones.length === 0 ? (
              <p className="mensaje-vacio">Aún no has postulado a ningún electivo.</p>
            ) : (
              postulaciones.map((post) => (
                <div key={post.post_id} className="postulacion-card">
                  <div className="card-image-container">
                    <img 
                      src={`https://picsum.photos/seed/${post.ele_cod}/300/200`} 
                      alt={post.ele_nombre} 
                      className="card-image"
                    />
                  </div>

                  <div className="card-body">
                    <div className="card-content-text">
                      <h2>{post.ele_nombre}</h2>
                      
                      <div className="postulacion-detalles">
                        <p><strong>Código:</strong> {post.ele_cod}</p>
                        <p><strong>Prioridad Seleccionada:</strong> Opción {post.post_pref}</p>
                        <p><strong>Fecha de Postulación:</strong> {new Date(post.post_fecha).toLocaleDateString()}</p>
                        <p>
                          <strong>Fecha de Resolución:</strong> {' '}
                          {post.post_fecha_asignacion 
                            ? new Date(post.post_fecha_asignacion).toLocaleDateString() 
                            : 'Aún no evaluada'}
                        </p>
                      </div>
                    </div>

                    <div className="card-actions">
                      <span className="badge-estado">
                        Estado: {post.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPostulaciones;