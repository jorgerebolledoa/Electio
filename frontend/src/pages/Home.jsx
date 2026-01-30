import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <--- Importamos el componente
import CourseCard from '../components/CourseCard';
import '../App.css'; 

const Home = () => {
  const navigate = useNavigate();

  // Datos simulados (MOCK)
  const electivos = [
    { id: 1, nombre: 'Criptografía', profesor: 'Rodrigo Abarzúa', cupos: 8, descripcion: 'Asignatura orientada al estudio de principios matemáticos y seguridad...' },
    { id: 2, nombre: 'Geometría Computacional', profesor: 'Rodrigo Abarzúa', cupos: 2, descripcion: 'Curso centrado en el estudio de algoritmos y estructuras...' },
    { id: 3, nombre: 'IA', profesor: 'Rodrigo Abarzúa', cupos: 0, descripcion: 'Estudio de técnicas que permiten simular comportamientos inteligentes.' },
  ];

  return (
    <div>
      {/* MODO PÚBLICO: Muestra botón "Iniciar Sesión" */}
      <Navbar tipo="publico" /> 

      <div className="main-container">
        
        {/* Dropdown Semestre */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', border: '2px solid #2C3516', padding: '8px 20px', fontWeight: 'bold' }}>
            ▼ Primer Semestre 2026
          </div>
        </div>

        {/* Lista de Cursos */}
        {electivos.map((ramo) => (
          <CourseCard 
            key={ramo.id}
            {...ramo} // Truco: Pasa todas las propiedades (nombre, desc, cupos) de una
            onAction={() => navigate('/login')}
            actionLabel="Postular"
          />
        ))}

      </div>
    </div>
  );
};

export default Home;