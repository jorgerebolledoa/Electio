import { useState } from 'react';
import Navbar from '../components/Navbar'; 
import '../App.css';

const SecretariaDashboard = () => {
  const [solicitudes] = useState([
    { rut: '19.234.567-8', nombre: 'Camila Fernández', electivo: 'Criptografía', prioridad: 1, cupo: 8, estado: 'pendiente' },
    { rut: '20.145.332-4', nombre: 'Sebastián Muñoz', electivo: 'IA', prioridad: 2, cupo: 12, estado: 'pendiente' },
    { rut: '21.003.778-9', nombre: 'Diego Aravena', electivo: 'IA', prioridad: 3, cupo: 12, estado: 'rechazado' },
  ]);

  return (
    <div>
      {/* Navbar de Secretaría */}
      <Navbar tipo="privado" />

      <div className="main-container">
        
        {/* Panel de Estadísticas */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '800', color: '#2C3516' }}>6</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Pendientes</span>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#ccc' }}></div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '800', color: '#888' }}>102</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Totales</span>
          </div>
        </div>

        {/* Tabla de Gestión */}
        <div style={{ overflowX: 'auto' }}> {/* Para que no se rompa en celular */}
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2C3516', textAlign: 'left', color: '#2C3516' }}>
                <th style={{ padding: '15px' }}>Rut</th>
                <th style={{ padding: '15px' }}>Nombre</th>
                <th style={{ padding: '15px' }}>Electivo</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Prioridad</th>
                <th style={{ padding: '15px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{row.rut}</td>
                  <td style={{ padding: '15px' }}>{row.nombre}</td>
                  <td style={{ padding: '15px' }}>{row.electivo}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>{row.prioridad}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    {row.estado === 'pendiente' ? (
                      <>
                        <button className="btn-primary" style={{padding: '5px 10px', fontSize: '0.8rem'}}>Aceptar</button>
                        <button style={{padding: '5px 10px', border: '1px solid #999', background:'transparent', borderRadius:'4px', cursor:'pointer'}}>Rechazar</button>
                      </>
                    ) : (
                      <span style={{ fontWeight: 'bold', color: row.estado === 'aceptado' ? 'green' : 'gray' }}>
                        {row.estado.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretariaDashboard;