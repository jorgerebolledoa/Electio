import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';       
import Login from './pages/Login';
import EstudianteDashboard from './pages/EstudianteDashboard';
import ListarInscritos from './pages/ListarInscritos';
import SecretariaDashboard from './pages/SecretariaDashboard';
import AdministrarElectivos from './pages/AdministrarElectivos';
import AdminDashboard from './pages/AdminDashboard';
import DetalleElectivo from './pages/DetalleElectivo';
import MisPostulaciones from './pages/MisPostulaciones'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        
        <Route path="/curso/:id" element={<DetalleElectivo />} />
        
        
        <Route path="/postular/:id" element={<DetalleElectivo />} />

        <Route path="/login" element={<Login />} />
        
        
        <Route path="/estudiante" element={<EstudianteDashboard />} />
        <Route path="/mis-postulaciones" element={<MisPostulaciones />} />

        
        <Route path="/secretaria" element={<SecretariaDashboard />} />
        <Route path="/secretaria/inscritos" element={<ListarInscritos />} />
        <Route path="/secretaria/electivos" element={<AdministrarElectivos />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;