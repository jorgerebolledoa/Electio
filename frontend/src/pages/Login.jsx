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

      // 1. Obtenemos el rol desde el backend
      const rolDelUsuario = respuesta.data.rol;
      
      // 2. Lo guardamos en la memoria del navegador
      sessionStorage.setItem('rolUsuario', rolDelUsuario);
      sessionStorage.setItem('rutUsuario', rut);

      // 3. Redirigimos según el rol
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
          <h2 className="login-title">
            Bienvenido a <br /> <span>ELECTIO</span>
          </h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label-text">RUT <span style={{ fontSize: '0.85em', color: '#666' }}>(sin punto ni guión, ejemplo: 12345678K)</span></label>
              <input
                type="text"
                className="input-box"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="Ingrese su rut"
                required
              />
            </div>

            <div className="form-group">
              <label className="label-text">Contraseña</label>
              <input
                type="password"
                className="input-box"
                value={password}
                placeholder="Ingrese su clave"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mensajeError && (
              <p className="mensaje-error-login">
                {mensajeError}
              </p>
            )}

            <p className="login-help-text">
              Si aún no tienes cuenta, contáctate con el administrador o secretaría de carrera.
            </p>

            <div style={{ textAlign: 'center' }}>
              <button type="submit" className="btn-primario login-btn">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;