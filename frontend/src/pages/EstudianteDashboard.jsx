import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import CourseCard from '../components/CourseCard';
import '../App.css';

const EstudianteDashboard = () => {
  const navigate = useNavigate();

  const electivos = [
    { id: "INF-401", nombre: 'Criptografía', profesor: 'Rodrigo Abarzúa', cupos: 8, descripcion: 'Asignatura orientada al estudio de principios matemáticos y seguridad...' },
    { id: "INF-402", nombre: 'Geometría Computacional', profesor: 'Rodrigo Abarzúa', cupos: 2, descripcion: 'Curso centrado en el estudio de algoritmos y estructuras...' },
    { id: "INF-403", nombre: 'IA', profesor: 'Rodrigo Abarzúa', cupos: 0, descripcion: 'Estudio de técnicas que permiten simular comportamientos inteligentes.' },
  ];

  return (
    <div>
      {/* CORRECCIÓN: Agregamos tipo="privado" para que muestre "Cerrar Sesión" */}
      <Navbar  tipo="privado" />

      <div className="main-container">
        <h2 style={{ color: '#2C3516', marginBottom: '20px' }}>Oferta Académica Disponible</h2>
        
        {electivos.map((ramo) => (
          <CourseCard 
            key={ramo.id}
            {...ramo}
            // Navegamos al detalle avisando que somos estudiantes
            onAction={() => navigate(`/curso/${ramo.id}`, { state: { soyEstudiante: true } })}
            actionLabel="Postular"
          />
        ))}
      </div>
    </div>
  );
};

export default EstudianteDashboard;