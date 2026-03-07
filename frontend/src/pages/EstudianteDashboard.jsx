import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard'; // <-- IMPORTAMOS LA TARJETA OFICIAL
import '../App.css';

const EstudianteDashboard = () => {
  const [electivos, setElectivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [semestre, setSemestre] = useState('1'); 
  const navigate = useNavigate();

  useEffect(() => {
    const cargarElectivos = async () => {
      setCargando(true);
      setError('');

      try {
        const rol = sessionStorage.getItem('rolUsuario');
        const configuracion = { headers: { rol: rol } };
        
        const respuesta = await axios.get(`http://localhost:3000/electivos/${semestre}`, configuracion);
        
        const listaOrdenada = respuesta.data.sort((a, b) => a.ele_cod.localeCompare(b.ele_cod));
        
        setElectivos(listaOrdenada);
        setCargando(false);
      } catch (err) {
        console.error("Error trayendo electivos:", err);
        setError('No se pudieron cargar los electivos. Verifica la conexión.');
        setCargando(false);
      }
    };

    cargarElectivos();
  }, [semestre]);

  const irAPostular = (codigo) => {
    navigate(`/postular/${codigo}`);
  };

  return (
    <div> 
      <Navbar tipo="privado" />
      
      
      <div className="main-container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <button className="btn-secundario-outline" onClick={() => navigate('/mis-postulaciones')}>
            Ver Mis Postulaciones
          </button>
          
          <select 
            className="select-semestre" 
            value={semestre} 
            onChange={(e) => setSemestre(e.target.value)}
          >
            <option value="1">Primer Semestre 2026</option>
            <option value="2">Segundo Semestre 2026</option>
          </select>
        </div>

        {cargando && <p className="mensaje-estado">Buscando electivos disponibles...</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && (
          <div className="electivos-lista">
            {electivos.length === 0 ? (
              <p className="mensaje-vacio">No hay electivos programados para este periodo.</p>
            ) : (
              electivos.map((electivo) => (
                /* REEMPLAZAMOS EL HTML VIEJO POR EL COMPONENTE OFICIAL */
                <CourseCard 
                  key={electivo.ele_cod}
                  id={electivo.ele_cod}
                  nombre={electivo.ele_nombre}
                  profesor={electivo.ele_profesor || 'Por asignar'}
                  cupos={electivo.ele_cupos}
                  descripcion={electivo.ele_descripcion}
                  img={electivo.ele_img}
                  onAction={() => irAPostular(electivo.ele_cod)}
                  actionLabel="Postular"
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteDashboard;