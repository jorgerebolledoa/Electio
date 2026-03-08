import '../App.css';
const CourseCard = ({ id, nombre, descripcion, profesor, cupos, img, onAction, actionLabel = "Postular" }) => {
  return (
    <div className="course-card">
      
      <div className="card-image-container">
        <img 
          src={img || `https://picsum.photos/seed/${id || 'default'}/300/200`} 
          alt={nombre} 
          className="card-image"
        />
      </div>
      
      <div className="card-body">
        <div className="card-content-text">
          <h2>{nombre}</h2>
          <p>{descripcion || 'Sin descripción disponible para este electivo.'}</p>
          <span className="profesor-span">Profesor: {profesor || 'Por asignar'}</span>
        </div>
        
        <div className="card-actions">
          <button 
            className={`btn-primario ${cupos === 0 ? 'agotado' : ''}`} 
            onClick={onAction}
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