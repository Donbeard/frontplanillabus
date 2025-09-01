import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { perfilesRutasAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import PerfilRutaForm from './PerfilRutaForm';

const PerfilesRutas = ({ ruta, onBack }) => {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar perfiles al montar el componente
  useEffect(() => {
    if (ruta) {
      loadPerfiles();
    }
  }, [ruta]);

  const loadPerfiles = async () => {
    try {
      setLoading(true);
      const response = await perfilesRutasAPI.getByRuta(ruta.id);
      setPerfiles(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando perfiles:', err);
      setError('Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (perfil) => {
    try {
      // Obtener la información completa del perfil
      const response = await perfilesRutasAPI.getById(perfil.id);
      setEditingPerfil(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información del perfil:', err);
      showError('Error al cargar la información del perfil');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
      try {
        await perfilesRutasAPI.delete(id);
        await loadPerfiles(); // Recargar la lista
        showSuccess('Perfil eliminado correctamente');
      } catch (err) {
        console.error('Error eliminando perfil:', err);
        showError('Error al eliminar el perfil');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPerfil(null);
  };

  const handleFormSubmit = async (perfilData) => {
    try {
      if (editingPerfil) {
        // Actualizar perfil existente
        await perfilesRutasAPI.update(editingPerfil.id, perfilData);
        showSuccess('Perfil actualizado correctamente');
      } else {
        // Crear nuevo perfil
        await perfilesRutasAPI.create(perfilData);
        showSuccess('Perfil creado correctamente');
      }
      await loadPerfiles(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando perfil:', err);
      showError('Error al guardar el perfil');
    }
  };

  const getDiasSemanaText = (dias) => {
    const diasMap = {
      1: 'Lun',
      2: 'Mar',
      3: 'Mié',
      4: 'Jue',
      5: 'Vie',
      6: 'Sáb',
      7: 'Dom'
    };
    return dias.map(dia => diasMap[dia] || dia).join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfiles de Ruta</h1>
              <p className="mt-1 text-sm text-gray-500">
                {ruta?.ciudad_origen?.nombre} - {ruta?.ciudad_destino?.nombre}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando perfiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfiles de Ruta</h1>
              <p className="mt-1 text-sm text-gray-500">
                {ruta?.ciudad_origen?.nombre} - {ruta?.ciudad_destino?.nombre}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadPerfiles}
              className="mt-2 btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perfiles de Ruta</h1>
            <p className="mt-1 text-sm text-gray-500">
              {ruta?.ciudad_origen?.nombre} - {ruta?.ciudad_destino?.nombre}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Perfil
        </button>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="table w-full">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Días</th>
                <th className="table-header-cell">Hora Inicio</th>
                <th className="table-header-cell">Hora Fin</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {perfiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-cell text-center text-gray-500 py-8">
                    No hay perfiles registrados para esta ruta
                  </td>
                </tr>
              ) : (
                perfiles.map((perfil) => (
                  <tr key={perfil.id} className="table-row">
                    <td className="table-cell">{getDiasSemanaText(perfil.dias_semana)}</td>
                    <td className="table-cell">{perfil.hora_inicio}</td>
                    <td className="table-cell">{perfil.hora_fin}</td>
                    <td className="table-cell">${perfil.valor?.toLocaleString() || 0}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        perfil.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {perfil.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(perfil)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(perfil.id)}
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
        <PerfilRutaForm
          perfil={editingPerfil}
          ruta={ruta}
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

export default PerfilesRutas;
