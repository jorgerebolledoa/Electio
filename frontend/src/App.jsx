import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';       
import Login from './pages/Login';
import EstudianteDashboard from './pages/EstudianteDashboard';
import SecretariaDashboard from './pages/SecretariaDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DetalleElectivo from './pages/DetalleElectivo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* NUEVA RUTA: Los dos puntos :id significan que eso cambia */}
        <Route path="/curso/:id" element={<DetalleElectivo />} />

        <Route path="/login" element={<Login />} />
        
        <Route path="/estudiante" element={<EstudianteDashboard />} />
        <Route path="/secretaria" element={<SecretariaDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;