import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se implementará la lógica de autenticación
    console.log('Login attempt:', formData);
    // Por ahora, redirigir al dashboard
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">PB</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            PlanillaBus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Control de Buses Intermunicipales
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-10"
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center py-3"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
