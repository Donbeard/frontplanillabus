import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, TicketIcon, TruckIcon } from '@heroicons/react/24/outline';
import { planillasAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import PlanillaForm from './PlanillaForm';
import TiquetesPlanilla from './TiquetesPlanilla';
import BusesPlanilla from './BusesPlanilla';

const Planillas = () => {
  const [planillas, setPlanillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlanilla, setEditingPlanilla] = useState(null);
  const [selectedPlanilla, setSelectedPlanilla] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'tiquetes', 'buses'
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar planillas al montar el componente
  useEffect(() => {
    loadPlanillas();
  }, []);

  const loadPlanillas = async () => {
    try {
      setLoading(true);
      const response = await planillasAPI.getAll();
      setPlanillas(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando planillas:', err);
      setError('Error al cargar las planillas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (planilla) => {
    try {
      // Obtener la información completa de la planilla
      const response = await planillasAPI.getById(planilla.id);
      setEditingPlanilla(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información de la planilla:', err);
      showError('Error al cargar la información de la planilla');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta planilla?')) {
      try {
        await planillasAPI.delete(id);
        await loadPlanillas(); // Recargar la lista
        showSuccess('Planilla eliminada correctamente');
      } catch (err) {
        console.error('Error eliminando planilla:', err);
        showError('Error al eliminar la planilla');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPlanilla(null);
  };

  const handleFormSubmit = async (planillaData) => {
    try {
      if (editingPlanilla) {
        // Actualizar planilla existente
        await planillasAPI.update(editingPlanilla.id, planillaData);
        showSuccess('Planilla actualizada correctamente');
      } else {
        // Crear nueva planilla
        await planillasAPI.create(planillaData);
        showSuccess('Planilla creada correctamente');
      }
      await loadPlanillas(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando planilla:', err);
      showError('Error al guardar la planilla');
    }
  };

  const handleViewTiquetes = (planilla) => {
    setSelectedPlanilla(planilla);
    setViewMode('tiquetes');
  };

  const handleViewBuses = (planilla) => {
    setSelectedPlanilla(planilla);
    setViewMode('buses');
  };

  const handleBackToList = () => {
    setSelectedPlanilla(null);
    setViewMode('list');
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 1: return 'Abierta';
      case 2: return 'Cerrada';
      case 3: return 'Anulada';
      default: return 'Desconocido';
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-gray-100 text-gray-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Si hay una planilla seleccionada y estamos en modo tiquetes, mostrar tiquetes
  if (selectedPlanilla && viewMode === 'tiquetes') {
    return (
      <TiquetesPlanilla
        planilla={selectedPlanilla}
        onBack={handleBackToList}
      />
    );
  }

  // Si hay una planilla seleccionada y estamos en modo buses, mostrar buses
  if (selectedPlanilla && viewMode === 'buses') {
    return (
      <BusesPlanilla
        planilla={selectedPlanilla}
        onBack={handleBackToList}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planillas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de planillas y tiquetes
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando planillas...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Planillas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de planillas y tiquetes
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadPlanillas}
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planillas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de planillas y tiquetes
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Planilla
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Buscar por número, prefijo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todos</option>
              <option value="1">Abierta</option>
              <option value="2">Cerrada</option>
              <option value="3">Anulada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio
            </label>
            <select className="input-field">
              <option value="">Todos los sitios</option>
              <option value="1">Terminal del Norte</option>
              <option value="2">Terminal del Sur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              className="input-field"
            />
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
                <th className="table-header-cell">Número</th>
                <th className="table-header-cell">Sitio</th>
                <th className="table-header-cell">Ruta</th>
                <th className="table-header-cell">Usuario</th>
                <th className="table-header-cell">Fecha</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Buses</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {planillas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-cell text-center text-gray-500 py-8">
                    No hay planillas registradas
                  </td>
                </tr>
              ) : (
                planillas.map((planilla) => (
                  <tr key={planilla.id} className="table-row">
                    <td className="table-cell">{planilla.prefijo}-{planilla.num_planilla}</td>
                    <td className="table-cell">{planilla.sitio?.nombre || 'N/A'}</td>
                    <td className="table-cell">{planilla.ruta?.ciudad_origen?.nombre} - {planilla.ruta?.ciudad_destino?.nombre}</td>
                    <td className="table-cell">{planilla.usuario?.nombre || 'N/A'}</td>
                    <td className="table-cell">{planilla.fecha_creacion}</td>
                    <td className="table-cell">${parseFloat(planilla.valor_planilla || 0).toLocaleString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {planilla.num_buses || 0} buses
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClass(planilla.estado)}`}>
                        {getEstadoText(planilla.estado)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(planilla)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewTiquetes(planilla)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver Tiquetes"
                        >
                          <TicketIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewBuses(planilla)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Ver Buses"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(planilla.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar"
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
        <PlanillaForm
          planilla={editingPlanilla}
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

export default Planillas;
