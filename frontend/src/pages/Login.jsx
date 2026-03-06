import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../App.css';

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensajeError('');

    try {
      const respuesta = await axios.post('http://localhost:3000/auth/login', {
        rut: rut,
        contrasena: password
      });

      const rolDelUsuario = respuesta.data.rol;

      if (rolDelUsuario === 'Estudiante') {
        navigate('/estudiante');
      } else if (rolDelUsuario === 'Secretaría') {
        navigate('/secretaria');
      } else if (rolDelUsuario === 'Admin') {
        navigate('/admin');
      } else {
        setMensajeError('Rol no reconocido.');
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMensajeError(error.response.data.error);
      } else {
        setMensajeError('Error de conexión con el servidor.');
      }
    }
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
                required
              />
            </div>

            <div>
              <label className="label-text">Contraseña</label>
              <input
                type="password"
                className="input-box"
                value={password}
                placeholder="************************"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mensajeError && (
              <p style={{ color: '#d9534f', fontSize: '0.9rem', fontWeight: 'bold', margin: '15px 0' }}>
                {mensajeError}
              </p>
            )}

            <p style={{ fontSize: '0.7rem', color: '#555', margin: '20px 0' }}>
              Si aun no tienes cuenta contactate con el administrador o secretaria de carrera
            </p>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 40px', background: '#4A5D23' }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;