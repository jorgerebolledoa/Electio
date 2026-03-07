import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Navbar = ({ tipo = 'publico', usuarioNombre }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      
      
      <div className="navbar-brand">
         <div className="navbar-logo-circle">
           
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="butt">
             <line x1="4" y1="6" x2="20" y2="6" />   
             <line x1="4" y1="12" x2="14" y2="12" /> 
             <line x1="4" y1="18" x2="20" y2="18" /> 
           </svg>
         </div>
         <h1 className="navbar-title-text" onClick={() => navigate('/')}>ELECTIO</h1> 
      </div>
      
      
      {tipo === 'publico' ? (
        <button 
          className="btn-primario" 
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {usuarioNombre && <span style={{ fontWeight: 800, color: '#1E1E1E' }}>{usuarioNombre}</span>}
            <button 
              className="btn-logout"
              onClick={() => {
                sessionStorage.removeItem('rolUsuario');
                sessionStorage.removeItem('rutUsuario');
                navigate('/');
              }}
            >
              Cerrar Sesión
            </button>
        </div>
      )}

    </nav>
  );
};

export default Navbar;