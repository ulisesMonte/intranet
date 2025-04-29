import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CerrarActividad = () => {
  const navigate = useNavigate();

  // Estados
  const [activityStatus, setActivityStatus] = useState('Cargando...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nuevos estados para los campos del formulario
  const [nombreSesion, setNombreSesion] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechaInicio, setFechaInicio] = useState('')
  const [horasSesion, setHoras] = useState('');
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

  
  const fetchfechaInicio = async() =>{
    try{
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No se encuentra un token válido');
      }

      // Enviar la solicitud al backend
      const response = await axios.get(
        'http://localhost:3000/api/auth/getFechaFin',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const formattedDate = new Date(response.data.fechaFin).toISOString().slice(0, 16); // "2025-04-03T19:18"
        setFechaFin(formattedDate)
      }
    }catch(err){

    }

  }

  // Ejecutar al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchActivityStatus(); // Consultar el estado inicial de la actividad
    fetchfechaInicio()
  }, [navigate]);


  // Función para iniciar la actividad
  const handleEndActivity = async () => {
    setLoading(true);
    setError(null);
    const dateInicio =  new Date(fechaInicio).getTime()
    const dateFin = new Date(fechaFin).getTime()
    const diff = dateFin - dateInicio; // Diferencia en milisegundos
    const horasTotales = Math.floor(diff / (1000 * 60 * 60)); // Convertir a hora

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No se encuentra un token válido');
      }
      const horas = Number(horasSesion);
      if(horas > horasTotales){
        setError('Las horas trabajadas no pueden ser mayores a las horas totales de la actividad')
        throw new Error('Las horas trabajadas no pueden ser mayores a las horas totales de la actividad')
      }
      const sessionData = {
        nombreSesion,
        fechaInicio,
        horas
      };

      // Enviar la solicitud al backend
      const response = await axios.put(
        'http://localhost:3000/api/auth/cerrarActividad',
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
      console.log(err)
      setError('Error al cerrar la actividad. Intenta de nuevo.');
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
          handleEndActivity(); // Al enviar el formulario, se inicia la actividad
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

        
        <div className="form-group">
          <label>Fecha inicio:</label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
          <label>Fecha Fin:</label>
          <input
            type="datetime-local"
            value={fechaFin}
            readOnly
        />
        </div>


        <div className="form-group">
          <label>Horas Trabajadas:</label>
          <input
            type="number"
            value={horasSesion}
            onChange={(e) => setHoras(e.target.value)}
            required 
        />
        </div>

        <div className="buttons-container">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Cerrando...' : 'Cerrar Actividad'}
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}
      <p>Estado actual de la actividad: {activityStatus}</p>
    </div>
  );
};

export default CerrarActividad;
