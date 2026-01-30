// src/components/CourseCard.jsx
import '../App.css';

// Desestructuramos las props para usar datos dinámicos
const CourseCard = ({ nombre, descripcion, profesor, cupos, onAction, actionLabel = "Postular" }) => {
  return (
    <div className="course-card">
      <div className="card-image"></div>
      
      <div className="card-content">
        <h2>{nombre}</h2>
        <p>{descripcion}</p>
        
        <div className="card-footer">
          <span className="profesor-text">Profesor: {profesor}</span>
          
          {/* El botón ejecuta la función que le pasemos desde el padre */}
          <button 
            className="btn-postular" 
            onClick={onAction}
            style={{ 
                backgroundColor: cupos === 0 ? '#999' : '#4A5D23',
                cursor: cupos === 0 ? 'not-allowed' : 'pointer'
            }}
            disabled={cupos === 0}
          >
            {cupos === 0 ? 'Agotado' : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;