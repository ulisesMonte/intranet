import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/licencias.css'
const AddLicencia = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nuevos estados para los campos del formulario
  const [fechaLicencia, setFechaLicencia] = useState('');
  const [razonLicencia, setRazonLicencia] = useState('');
  
  // Estado para las licencias del usuario
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    getLicencias(); // Llamada para obtener las licencias
  }, [navigate]);

  const getLicencias = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No existe el token');
      }
      const response = await axios.get('http://localhost:3000/api/auth/getLicencias', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLicencias(response.data); // Guardar las licencias en el estado
    } catch (err) {
      console.log(err);
    }
  };

  // Función para agregar una nueva licencia
  const handleAddLicense = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No se encuentra un token válido');
      }
      const licenciaData = {
        razonLicencia,
        fechaLicencia,
      };

      // Enviar la solicitud al backend
      const response = await axios.post('http://localhost:3000/api/auth/addLicencia', licenciaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Actualizar las licencias luego de agregar una nueva
        getLicencias();
      }
    } catch (err) {
      setError('Error al agregar la licencia. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="index-container">
      <h2>Gestión de Licencias</h2>
      
      {/* Formulario para ingresar los datos */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddLicense(); // Al enviar el formulario, se agrega la licencia
        }}
      >
        <div className="form-group">
          <label>Razón de la licencia:</label>
          <input
            type="text"
            value={razonLicencia}
            onChange={(e) => setRazonLicencia(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha Licencia:</label>
          <input
            type="datetime-local"
            value={fechaLicencia}
            onChange={(e) => setFechaLicencia(e.target.value)}
            required
          />
        </div>

        <div className="buttons-container">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Licencia'}
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="licencias-list">
        <h3>Licencias Actuales</h3>
        {licencias.length > 0 ? (
          <ul>
            {licencias.map((licencia, index) => (
              <li key={index}>
                <p><strong>Razón:</strong> {licencia.razonLicencia}</p>
                <p><strong>Fecha:</strong> {new Date(licencia.fechaLicencia).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay licencias disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default AddLicencia;
