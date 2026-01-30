import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Navbar = ({ tipo = 'publico', usuarioNombre }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
         <div style={{
           background: '#2C3516', color:'white', width:'40px', height:'40px', 
           borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', 
           fontWeight:'bold', fontSize: '1.2rem'
         }}>☰</div>
         <h1 style={{ color: '#1A1A1A' }}>ELECTIO</h1> 
      </div>
      
      {tipo === 'publico' ? (
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '10px 20px', background: '#4A5D23' }}
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {usuarioNombre && <span style={{fontWeight: 'bold'}}>{usuarioNombre}</span>}
            <button 
              className="btn-logout"
              onClick={() => navigate('/')}
            >
              Cerrar Sesión
            </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;