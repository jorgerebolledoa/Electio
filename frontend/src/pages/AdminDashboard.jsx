import Navbar from '../components/Navbar';
import '../App.css';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar tipo="privado" />

      <div className="main-container">
        <h1>Panel de Administración</h1>
        <p>Gestión de tablas maestras del sistema.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '2rem' }}>
          {['Usuarios', 'Electivos', 'Periodos', 'Roles'].map((item) => (
            <div key={item} style={{ 
              background: 'white', 
              padding: '2rem', 
              border: '2px solid #2C3516',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => alert(`Navegar a administrar ${item}`)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ margin: 0 }}>Administrar {item}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;