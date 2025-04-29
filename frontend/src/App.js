import logo from './logo.svg';
import './App.css';
import Register from './public/register';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './public/login'
import Index from './public/index';
import IniciarActividad from './public/iniciarActividad';
import CerrarActividad from './public/cerrarActividad';
import AddLicencia from './public/licencias';

function App() {
  return (
  <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/iniciarActividad" element={<IniciarActividad/>} />
        <Route path="/cerrarActividad" element={<CerrarActividad/>} />
        <Route path="/licencias" element={<AddLicencia/>} />


      </Routes>
    </Router>
  );
}

export default App;
