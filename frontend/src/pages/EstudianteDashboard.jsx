import { useState } from 'react';
import Navbar from '../components/Navbar'; 
import CourseCard from '../components/CourseCard';
import '../App.css';

const EstudianteDashboard = () => {
  const [electivos] = useState([
    { id: 1, nombre: 'Criptografía', profesor: 'Rodrigo Abarzúa', cupos: 8, descripcion: 'Principios de seguridad...' },
    { id: 2, nombre: 'IA', profesor: 'Rodrigo Abarzúa', cupos: 0, descripcion: 'Inteligencia Artificial avanzada...' },
  ]);

  const handlePostular = (nombre) => {
    alert(`¡Postulación enviada para ${nombre}!`);
  };

  return (
    <div>
      
      <Navbar usuarioNombre="Estudiante" />

      <div className="main-container">
        <h2 style={{ color: '#2C3516', marginBottom: '20px' }}>Oferta Académica Disponible</h2>
        
        {electivos.map((ramo) => (
          <CourseCard 
            key={ramo.id}
            {...ramo}
            onAction={() => handlePostular(ramo.nombre)}
            actionLabel="Postular"
          />
        ))}
      </div>
    </div>
  );
};

export default EstudianteDashboard;            