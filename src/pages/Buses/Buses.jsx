import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import BusForm from './BusForm';
import { busesAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import ResponsiveTable from '../../components/ResponsiveTable/ResponsiveTable';

const Buses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar buses al montar el componente
  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const response = await busesAPI.getAll();
      setBuses(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando buses:', err);
      setError('Error al cargar los buses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bus?')) {
      try {
        await busesAPI.delete(id);
        await loadBuses(); // Recargar la lista
        showSuccess('Bus eliminado correctamente');
      } catch (err) {
        console.error('Error eliminando bus:', err);
        showError('Error al eliminar el bus');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBus(null);
  };

  const handleFormSubmit = async (busData) => {
    try {
      if (editingBus) {
        // Actualizar bus existente
        await busesAPI.update(editingBus.id, busData);
        showSuccess('Bus actualizado correctamente');
      } else {
        // Crear nuevo bus
        await busesAPI.create(busData);
        showSuccess('Bus creado correctamente');
      }
      await loadBuses(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando bus:', err);
      showError('Error al guardar el bus');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buses</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de buses y conductores
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando buses...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Buses</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de buses y conductores
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadBuses}
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
          <h1 className="text-2xl font-bold text-gray-900">Buses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de buses y conductores
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Bus
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
              placeholder="Buscar por placa, modelo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad
            </label>
            <select className="input-field">
              <option value="">Todas</option>
              <option value="30">30+ pasajeros</option>
              <option value="40">40+ pasajeros</option>
              <option value="50">50+ pasajeros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="card">
        <ResponsiveTable
          data={buses}
          columns={[
            {
              key: 'placa',
              label: 'Placa',
              render: (bus) => <span className="font-medium">{bus.placa}</span>
            },
            {
              key: 'modelo',
              label: 'Modelo'
            },
            {
              key: 'capacidad',
              label: 'Capacidad',
              render: (bus) => `${bus.capacidad} pasajeros`
            },
            {
              key: 'fecha_soat',
              label: 'SOAT'
            },
            {
              key: 'fecha_tecno',
              label: 'Técnico'
            },
            {
              key: 'estado',
              label: 'Estado',
              render: (bus) => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  bus.activo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bus.activo ? 'Activo' : 'Inactivo'}
                </span>
              )
            }
          ]}
          emptyMessage="No hay buses registrados"
          onEdit={handleEdit}
          onDelete={(bus) => handleDelete(bus.id)}
          getRowKey={(bus) => bus.id}
          getRowTitle={(bus) => bus.placa}
        />
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <BusForm
          bus={editingBus}
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

export default Buses;
