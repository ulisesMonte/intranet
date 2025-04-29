import React, { useState } from 'react';
import axios from 'axios';
import './css/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      name,
      email,
      password,
    };

    try {
      // Hacer solicitud POST para registrar al usuario
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      const token = response.data.access_token;

        // Guardar el token en localStorage
      localStorage.setItem('access_token', token);

        // Opcional: Guardar también los datos del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));

        // Llamar a la función onRegister para realizar acciones después del registro

      navigate("/index")
    } catch (err) {
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2> {/* El título estará aquí arriba */}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu nombre"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit" className="submit-btn">Registrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;
