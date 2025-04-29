import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Index.css'; // Asegúrate de tener este archivo de estilos
import axios from 'axios'; 
const Index = () => {
  const navigate = useNavigate();
  
  const [activityStatus, setActivityStatus] = useState('Cargando...');
  const [horas,sethorasMes] = useState('Cargando Horas')
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');  // Redirige al login si no hay token
      }
      

      // Si el token es inválido, redirige al login.
    };

  
    fetchActivityStatus()
    fetchHoras()
    checkToken();
  }, [navigate]); // Dependencia vacía significa que se ejecutará solo una vez al montar el componente.


  const fetchHoras = async () =>{
    try{
    const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:3000/api/auth/getHoras',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      sethorasMes(response.data.horasMes);
    }catch (err) {
      sethorasMes('Se produjo un error');
    }
  };
  const fetchActivityStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:3000/api/auth/getActividad',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivityStatus(response.data.activityStatus);
    } catch (err) {
      setActivityStatus('Inactivo');
    }
  };

  const handleStartActivity = () => {
    navigate("/iniciarActividad")
  };

  const handleSeeLicense = () =>{
    navigate('/licencias')
  }

  const handleEndActivity = () => {
    navigate("/cerrarActividad")
  };

  const handleViewReports = () => {
    navigate('/reports');  // Cambia a la ruta que quieras
  };

  return (
    <div className="index-container">
      <h2>Gestión de Actividades</h2>
      <h3>Horas trabajadas en el mes: {horas}</h3>
      <p>Estado actual de la actividad: {activityStatus}</p>
      <div className="buttons-container">
        <button className="btn" onClick={handleStartActivity}>Iniciar Actividad</button>
        <button className="btn" onClick={handleEndActivity}>Cerrar Actividad</button>
        <button className="btn" onClick={handleSeeLicense}>Licencias</button>
        <button className="btn" onClick={handleViewReports}>Ver Reportes</button>
      </div>
    </div>
  );
};

export default Index;
