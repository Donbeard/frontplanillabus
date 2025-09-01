import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { tiquetesAPI, coreAPI, usuariosAPI, perfilesRutasAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import TiqueteForm from './TiqueteForm';

const TiquetesPlanilla = ({ planilla, onBack }) => {
  const [tiquetes, setTiquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTiquete, setEditingTiquete] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar tiquetes al montar el componente
  useEffect(() => {
    if (planilla) {
      loadTiquetes();
    }
  }, [planilla]);

  const loadTiquetes = async () => {
    try {
      setLoading(true);
      const response = await tiquetesAPI.porPlanilla(planilla.id);
      setTiquetes(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando tiquetes:', err);
      setError('Error al cargar los tiquetes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (tiquete) => {
    try {
      // Obtener la información completa del tiquete
      const response = await tiquetesAPI.getById(tiquete.id);
      setEditingTiquete(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información del tiquete:', err);
      showError('Error al cargar la información del tiquete');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tiquete?')) {
      try {
        await tiquetesAPI.delete(id);
        await loadTiquetes(); // Recargar la lista
        showSuccess('Tiquete eliminado correctamente');
      } catch (err) {
        console.error('Error eliminando tiquete:', err);
        showError('Error al eliminar el tiquete');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTiquete(null);
  };

  const handleFormSubmit = async (tiqueteData) => {
    try {
      if (editingTiquete) {
        // Actualizar tiquete existente
        await tiquetesAPI.update(editingTiquete.id, tiqueteData);
        showSuccess('Tiquete actualizado correctamente');
      } else {
        // Crear nuevo tiquete
        await tiquetesAPI.create(tiqueteData);
        showSuccess('Tiquete creado correctamente');
      }
      await loadTiquetes(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando tiquete:', err);
      showError('Error al guardar el tiquete');
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Tiquetes de Planilla</h1>
              <p className="mt-1 text-sm text-gray-500">
                {planilla?.prefijo}-{planilla?.num_planilla}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando tiquetes...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Tiquetes de Planilla</h1>
              <p className="mt-1 text-sm text-gray-500">
                {planilla?.prefijo}-{planilla?.num_planilla}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadTiquetes}
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
            <h1 className="text-2xl font-bold text-gray-900">Tiquetes de Planilla</h1>
            <p className="mt-1 text-sm text-gray-500">
              {planilla?.prefijo}-{planilla?.num_planilla} - {planilla?.ruta?.ciudad_origen?.nombre} - {planilla?.ruta?.ciudad_destino?.nombre}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Tiquete
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{tiquetes.length}</p>
            <p className="text-sm text-gray-600">Total Tiquetes</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {tiquetes.reduce((total, tiquete) => total + (tiquete.num_asientos || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Pasajeros</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ${tiquetes.reduce((total, tiquete) => total + (parseFloat(tiquete.total) || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Recaudado</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${tiquetes.length > 0 ? (tiquetes.reduce((total, tiquete) => total + (parseFloat(tiquete.total) || 0), 0) / tiquetes.length).toFixed(2) : 0}
            </p>
            <p className="text-sm text-gray-600">Promedio por Tiquete</p>
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
                <th className="table-header-cell">Pasajero</th>
                <th className="table-header-cell">Documento</th>
                <th className="table-header-cell">Asientos</th>
                <th className="table-header-cell">Valor Unitario</th>
                <th className="table-header-cell">Total</th>
                <th className="table-header-cell">Vendedor</th>
                <th className="table-header-cell">Fecha</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {tiquetes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell text-center text-gray-500 py-8">
                    No hay tiquetes registrados para esta planilla
                  </td>
                </tr>
              ) : (
                tiquetes.map((tiquete) => (
                  <tr key={tiquete.id} className="table-row">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium">{tiquete.nombre}</p>
                        <p className="text-sm text-gray-500">{tiquete.correo}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-sm text-gray-500">{tiquete.tipo_documento}</p>
                        <p className="font-medium">{tiquete.numero_documento}</p>
                      </div>
                    </td>
                    <td className="table-cell">{tiquete.num_asientos}</td>
                    <td className="table-cell">${parseFloat(tiquete.valor_unitario || 0).toLocaleString()}</td>
                    <td className="table-cell">${parseFloat(tiquete.total || 0).toLocaleString()}</td>
                    <td className="table-cell">{tiquete.vendedor?.nombre || 'N/A'}</td>
                    <td className="table-cell">
                      {new Date(tiquete.creado_en).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tiquete)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tiquete.id)}
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
        <TiqueteForm
          tiquete={editingTiquete}
          planilla={planilla}
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

export default TiquetesPlanilla;
