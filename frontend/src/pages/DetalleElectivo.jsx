import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';

const DetalleElectivo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para leer el estado que enviamos desde el Dashboard

  // Detectamos si es estudiante leyendo el estado de la navegación
  const esEstudiante = location.state?.soyEstudiante;

  // ESTADOS DEL MODAL
  const [mostrarModal, setMostrarModal] = useState(false);
  const [prioridad, setPrioridad] = useState(1);
  const [postulacionExitosa, setPostulacionExitosa] = useState(false);

  // DATA MOCK
  const cursosData = [
    { id: "INF-401", nombre: 'Criptografía', profesor: 'Rodrigo Abarzúa', cuposDisponibles: 8, cuposTotales: 30, horarios: [{ dia: 'Martes', hora: '15:30 - 17:00' }], descripcion: 'Asignatura orientada al estudio de seguridad.' },
    { id: "INF-402", nombre: 'Geometría Computacional', profesor: 'Rodrigo Abarzúa', cuposDisponibles: 2, cuposTotales: 25, horarios: [{ dia: 'Lunes', hora: '09:40 - 11:10' }], descripcion: 'Algoritmos geométricos.' },
  ];
  
  const curso = cursosData.find(c => c.id === id);

  // MANEJO DE LA POSTULACIÓN
  const handleBotonPostular = () => {
    if (esEstudiante) {
      setMostrarModal(true); // Si es estudiante, abrimos modal
    } else {
      navigate('/login'); // Si es público, mandamos al login
    }
  };

  const confirmarPostulacion = () => {
    // Aquí iría la conexión con el Backend de Jorge
    console.log(`Postulando a ${curso.nombre} con prioridad ${prioridad}`);
    setPostulacionExitosa(true); // Mostramos mensaje de éxito
    // setMostrarModal(false); // No cerramos el modal inmediato para que vea el éxito
  };

  const cerrarTodo = () => {
    setMostrarModal(false);
    setPostulacionExitosa(false);
    navigate('/estudiante'); // Opcional: Volver al dashboard al terminar
  };

  if (!curso) return <div className="main-container">Curso no encontrado</div>;

  return (
    <div>
      {/* NAVBAR DINÁMICO: Si es estudiante muestra "Cerrar Sesión", si no "Iniciar" */}
      <Navbar usuarioNombre={esEstudiante ? "Estudiante" : null} tipo={esEstudiante ? "privado" : "publico"} />

      <div className="main-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>‹</span> Volver
        </button>

        <div className="detalle-layout">
          {/* ... (COLUMNA IZQUIERDA IGUAL QUE ANTES) ... */}
          <div className="col-left">
            <h1 className="curso-nombre">{curso.nombre}</h1>
            <div className="detalle-foto"></div>
            <div className="horario-box">
              <h3 className="horario-titulo">HORARIO</h3>
              <div className="horario-lista">
                {curso.horarios.map((bloque, i) => (
                  <div key={i} className="horario-fila"><span className="dia">{bloque.dia}</span><span className="hora">{bloque.hora}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="col-right">
            <h2 className="seccion-titulo">Acerca del electivo</h2>
            <p className="curso-descripcion">{curso.descripcion}</p>
            <div className="profesor-box"><span className="label">Profesor:</span> <span className="valor">{curso.profesor}</span></div>

            <div className="bottom-action-area">
              <div className="cupos-container"> 
                <span className="cupos-main-title">Cupos:</span>
                <div className="cupos-row">  
                  <div className="cupo-box"><span className="cupo-label">Disponibles</span><span className="cupo-valor disponible">{curso.cuposDisponibles}</span></div>
                  <div className="cupo-box"><span className="cupo-label">Totales</span><span className="cupo-valor total">{curso.cuposTotales}</span></div>
                </div>
              </div>

              <button 
                className="btn-postular-grande"
                onClick={handleBotonPostular} // <--- AHORA LLAMA A LA FUNCIÓN INTELIGENTE
                disabled={curso.cuposDisponibles === 0}
              >
                {curso.cuposDisponibles > 0 ? 'POSTULAR' : 'AGOTADO'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL (VENTANA EMERGENTE) --- */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {!postulacionExitosa ? (
              /* VISTA 1: SELECCIONAR PRIORIDAD */
              <>
                <h2 style={{color: '#2C3516'}}>Confirmar Postulación</h2>
                <p>Estás postulando a: <strong>{curso.nombre}</strong></p>
                
                <label style={{display: 'block', margin: '20px 0', textAlign:'left'}}>
                  Selecciona la prioridad de tu postulacion para este electivo, de 1 a 5 donde 1 es la prioridad más alta y 5 la más baja:
                  <select 
                    value={prioridad} 
                    onChange={(e) => setPrioridad(e.target.value)}
                    className="select-prioridad"
                  >
                    <option value="1">Prioridad 1 </option>
                    <option value="2">Prioridad 2 </option>
                    <option value="3">Prioridad 3 </option>
                    <option value="4">Prioridad 4 </option>
                    <option value="5">Prioridad 5 </option>
                  </select>
                </label>

                <div className="modal-actions">
                  <button onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
                  <button onClick={confirmarPostulacion} className="btn-confirmar">Enviar Postulación</button>
                </div>
              </>
            ) : (
              /* VISTA 2: MENSAJE DE ÉXITO */
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '3rem', color: 'green', marginBottom: '10px'}}>✓</div>
                <h2 style={{color: '#2C3516'}}>¡Postulación Enviada!</h2>
                <p>Tu solicitud ha sido registrada correctamente con prioridad {prioridad}.</p>
                <button onClick={cerrarTodo} className="btn-confirmar" style={{width: '100%', marginTop: '20px'}}>
                  Entendido
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default DetalleElectivo;