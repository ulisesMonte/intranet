import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/iniciarActividad.css'
const IniciarActividad = () => {
  const navigate = useNavigate();

  // Estados
  const [activityStatus, setActivityStatus] = useState('Cargando...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nuevos estados para los campos del formulario
  const [nombreSesion, setNombreSesion] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Función para obtener el estado de la actividad
  const fetchActivityStatus = async () => {
    setLoading(true);
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
      setError('Error al cargar el estado de la actividad.');
      setActivityStatus('Inactivo');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchActivityStatus(); // Consultar el estado inicial de la actividad
  }, [navigate]);

  // Función para iniciar la actividad
  const handleStartActivity = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No se encuentra un token válido');
      }
      const sessionData = {
        nombreSesion,
        fechaFin,
      };

      // Enviar la solicitud al backend
      const response = await axios.post(
        'http://localhost:3000/api/auth/iniciarActividad',
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        fetchActivityStatus(); 
      }
    } catch (err) {
      setError('Error al iniciar la actividad. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="index-container">
      <h2>Gestión de Actividades</h2>
      
      {/* Formulario para ingresar los datos */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartActivity();
          fetchActivityStatus() // Al enviar el formulario, se inicia la actividad
        }}
      >
        <div className="form-group">
          <label>Nombre de la sesión:</label>
          <input
            type="text"
            value={nombreSesion}
            onChange={(e) => setNombreSesion(e.target.value)}
            required
          />
        </div>

        
        <div className="form-g  roup">
          <label>Fecha inicio:</label>
          <input
            type="text"
            value={new Date()}
            readOnly
            />
        </div>
        <div className="form-group">
          <label>Fecha de Fin:</label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>

        <div className="buttons-container">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Actividad'}
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}
      <p>Estado actual de la actividad: {activityStatus}</p>
    </div>
  );
};

export default IniciarActividad;
