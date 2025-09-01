import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { rutasAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import RutaForm from './RutaForm';
import PerfilesRutas from './PerfilesRutas';

const Rutas = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRuta, setEditingRuta] = useState(null);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar rutas al montar el componente
  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      setLoading(true);
      const response = await rutasAPI.getAll();
      setRutas(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando rutas:', err);
      setError('Error al cargar las rutas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (ruta) => {
    try {
      // Obtener la información completa de la ruta
      const response = await rutasAPI.getById(ruta.id);
      setEditingRuta(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información de la ruta:', err);
      showError('Error al cargar la información de la ruta');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      try {
        await rutasAPI.delete(id);
        await loadRutas(); // Recargar la lista
        showSuccess('Ruta eliminada correctamente');
      } catch (err) {
        console.error('Error eliminando ruta:', err);
        showError('Error al eliminar la ruta');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRuta(null);
  };

  const handleFormSubmit = async (rutaData) => {
    try {
      if (editingRuta) {
        // Actualizar ruta existente
        await rutasAPI.update(editingRuta.id, rutaData);
        showSuccess('Ruta actualizada correctamente');
      } else {
        // Crear nueva ruta
        await rutasAPI.create(rutaData);
        showSuccess('Ruta creada correctamente');
      }
      await loadRutas(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando ruta:', err);
      showError('Error al guardar la ruta');
    }
  };

  const handleViewPerfiles = (ruta) => {
    setSelectedRuta(ruta);
  };

  const handleBackToRutas = () => {
    setSelectedRuta(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de rutas y perfiles de horarios
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando rutas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de rutas y perfiles de horarios
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadRutas}
              className="mt-2 btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si hay una ruta seleccionada, mostrar los perfiles de esa ruta
  if (selectedRuta) {
    return (
      <PerfilesRutas
        ruta={selectedRuta}
        onBack={handleBackToRutas}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de rutas y perfiles de horarios
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Ruta
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Buscar por origen, destino..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todas</option>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origen
            </label>
            <select className="input-field">
              <option value="">Todas las ciudades</option>
              <option value="1">Medellín</option>
              <option value="2">Bogotá</option>
              <option value="3">Cali</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="table w-full">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Origen</th>
                <th className="table-header-cell">Destino</th>
                <th className="table-header-cell">Perfiles</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {rutas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-cell text-center text-gray-500 py-8">
                    No hay rutas registradas
                  </td>
                </tr>
              ) : (
                rutas.map((ruta) => (
                  <tr key={ruta.id} className="table-row">
                    <td className="table-cell">{ruta.ciudad_origen?.nombre || 'N/A'}</td>
                    <td className="table-cell">{ruta.ciudad_destino?.nombre || 'N/A'}</td>
                    <td className="table-cell">{ruta.num_perfiles || 0} perfiles</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ruta.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ruta.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(ruta)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewPerfiles(ruta)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <ClockIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ruta.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <RutaForm
          ruta={editingRuta}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}
    </div>
  );
};

export default Rutas;
