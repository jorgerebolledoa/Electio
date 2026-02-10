import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css'; 

const Login = () => {
  const [rut, setRut] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (rut.includes('admin')) navigate('/admin');
    else if (rut.includes('sec')) navigate('/secretaria');
    else navigate('/estudiante');
  };

  return (
    <div>
      <Navbar tipo="publico" />

      <div className="login-wrapper">
        
        <div className="login-card">
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#1A1A1A' }}>
            Bienvenido a <br /> ELECTIO
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label-text">Rut</label>
              <input 
                type="text" 
                className="input-box" 
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">Contraseña</label>
              <input 
                type="password" 
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p style={{ fontSize: '0.7rem', color: '#555', margin: '20px 0' }}>
              Si aun no tienes cuenta contactate con el administrador o secretaria de carrera
            </p>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: 'auto', padding: '10px 40px', background: '#4A5D23' }}
            >
              Iniciar Sesion
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;