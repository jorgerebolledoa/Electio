import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import '../App.css'; 

const Home = () => {
  const navigate = useNavigate();
  
  const [electivos, setElectivos] = useState([]);
  const [periodos, setPeriodos] = useState([]); // NUEVO: Estado para guardar los periodos
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [semestre, setSemestre] = useState(''); // NUEVO: Inicia vacío hasta que la BD responda

  // 1. CARGAMOS LOS PERIODOS PÚBLICOS
  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/electivos/periodos/todos');
        
      

       
        const periodosCronologicos = [...respuesta.data].reverse();
        setPeriodos(periodosCronologicos);
        if (periodosCronologicos.length > 0) {
          setSemestre(periodosCronologicos[0].per_id.toString());
        }
        

      } catch (err) {
        console.error("Error al cargar los periodos en Home:", err);
      }
    };
    cargarPeriodos();
  }, []);

  // 2. CARGAMOS LOS ELECTIVOS DEL PERIODO SELECCIONADO
  useEffect(() => {
    const cargarCatálogo = async () => {
      if (!semestre) return; // Evita hacer peticiones si el semestre aún no carga

      setCargando(true);
      setError('');
      try {
        const respuesta = await axios.get(`http://localhost:3000/electivos/${semestre}`);
        const listaOrdenada = respuesta.data.sort((a, b) => a.ele_cod.localeCompare(b.ele_cod));
        
        setElectivos(listaOrdenada);
        setCargando(false);
      } catch (err) {
        console.error("Error al cargar la vitrina pública:", err);
        setError('No se pudo cargar el catálogo de electivos en este momento.');
        setCargando(false);
      }
    };

    cargarCatálogo();
  }, [semestre]);

  // Lógica de sesión limpia
  const rol = sessionStorage.getItem('rolUsuario');
  const tieneSesion = rol && rol !== 'null' && rol !== 'undefined';
  const esEstudiante = rol === 'Estudiante';

  return (
    <div>
      <Navbar tipo={tieneSesion ? "privado" : "publico"} /> 

      <div className="main-container">
        
       
        <div className="filtros-container" style={{ 
            display: 'flex', 
            justifyContent: (tieneSesion && esEstudiante) ? 'space-between' : 'flex-end',
            alignItems: 'center',
            marginBottom: '2rem'
        }}>
          
          
          {tieneSesion && esEstudiante && (
            <button 
              className="btn-secundario-outline" 
              onClick={() => navigate('/mis-postulaciones')}
            >
              Ver Mis Postulaciones
            </button>
          )}

          
          <select 
            className="select-semestre"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
          >
            {periodos.length === 0 ? (
              <option value="">Cargando periodos...</option>
            ) : (
              periodos.map(p => (
                <option key={p.per_id} value={p.per_id}>
                  {p.per_semestre === 1 ? 'Primer' : 'Segundo'} Semestre {p.per_ano}
                </option>
              ))
            )}
          </select>
        </div>

        {cargando && <p className="mensaje-estado">Cargando catálogo de electivos...</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <div className="electivos-lista">
          {!cargando && !error && electivos.length === 0 ? (
            <p className="mensaje-vacio">No hay electivos programados para este periodo.</p>
          ) : (
            !cargando && electivos.map((ramo) => (
              <CourseCard 
                key={ramo.ele_cod}
                id={ramo.ele_cod}
                nombre={ramo.ele_nombre}
                profesor={ramo.ele_profesor || 'Por asignar'}
                cupos={ramo.ele_cupos}
                descripcion={ramo.ele_descripcion}
                img={ramo.ele_img} 
                onAction={() => navigate(`/postular/${ramo.ele_cod}`)}
                actionLabel="Ver Detalles"
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;