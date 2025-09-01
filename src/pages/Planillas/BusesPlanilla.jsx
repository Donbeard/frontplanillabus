import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/outline';
import { planillaBusAPI, busesAPI, conductoresAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';
import BusAsignacionForm from './BusAsignacionForm';

const BusesPlanilla = ({ planilla, onBack }) => {
  const [busesAsignados, setBusesAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadBusesAsignados();
  }, [planilla.id]);

  const loadBusesAsignados = async () => {
    try {
      setLoading(true);
      console.log('Cargando buses asignados para planilla ID:', planilla.id);
      const response = await planillaBusAPI.porPlanilla(planilla.id);
      console.log('Respuesta de buses asignados:', response.data);
      setBusesAsignados(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando buses asignados:', error);
      console.error('Detalles del error:', error.response?.data);
      showError('Error al cargar los buses asignados');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (busAsignado) => {
    console.log('handleEdit - Bus asignado seleccionado:', busAsignado);
    setEditingBus(busAsignado);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación de bus?')) {
      try {
        await planillaBusAPI.delete(id);
        await loadBusesAsignados();
        showSuccess('Asignación de bus eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando asignación:', error);
        showError('Error al eliminar la asignación de bus');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBus(null);
  };

  const handleFormSubmit = async (busData) => {
    try {
      console.log('handleFormSubmit - Datos recibidos:', busData);
      console.log('handleFormSubmit - editingBus:', editingBus);
      
      if (editingBus) {
        console.log('Actualizando bus asignado con ID:', editingBus.id);
        const response = await planillaBusAPI.update(editingBus.id, busData);
        console.log('Respuesta de actualización:', response);
        showSuccess('Asignación de bus actualizada correctamente');
      } else {
        console.log('Creando nueva asignación de bus');
        const response = await planillaBusAPI.create(busData);
        console.log('Respuesta de creación:', response);
        showSuccess('Bus asignado correctamente');
      }
      await loadBusesAsignados();
      handleFormClose();
    } catch (error) {
      console.error('Error guardando asignación:', error);
      console.error('Detalles del error:', error.response?.data);
      showError('Error al guardar la asignación de bus');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // Mostrar solo HH:MM
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Buses de Planilla {planilla.prefijo}-{planilla.num_planilla}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {planilla.ruta?.ciudad_origen?.nombre} - {planilla.ruta?.ciudad_destino?.nombre}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Asignar Bus
        </button>
      </div>

      {/* Información de la planilla */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <TruckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{busesAsignados.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-6 w-6 text-green-600 mr-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(planilla.valor_planilla || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-6 w-6 text-yellow-600 mr-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor por Bus</p>
              <p className="text-2xl font-bold text-gray-900">
                {busesAsignados.length > 0 
                  ? formatCurrency((planilla.valor_planilla || 0) / busesAsignados.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-6 w-6 text-purple-600 mr-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pasajeros</p>
              <p className="text-2xl font-bold text-gray-900">
                {busesAsignados.reduce((sum, bus) => sum + (parseInt(bus.numero_pasajeros) || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de buses asignados */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando buses asignados...</p>
          </div>
        ) : (
          <div className="table-scroll-container">
            <div className="table-container">
              <table className="table w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Bus</th>
                  <th className="table-header-cell">Conductor</th>
                  <th className="table-header-cell">Pasajeros</th>
                  <th className="table-header-cell">Fecha Salida</th>
                  <th className="table-header-cell">Hora Salida</th>
                  <th className="table-header-cell">Fecha Llegada</th>
                  <th className="table-header-cell">Hora Llegada</th>
                  <th className="table-header-cell">Valor Bus</th>
                  <th className="table-header-cell">Estado</th>
                  <th className="table-header-cell">Acciones</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {busesAsignados.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="table-cell text-center text-gray-500 py-8">
                      No hay buses asignados a esta planilla
                    </td>
                  </tr>
                ) : (
                  busesAsignados.map((busAsignado) => (
                    <tr key={busAsignado.id} className="table-row">
                                             <td className="table-cell font-medium">
                         {busAsignado.bus?.placa || busAsignado.bus_placa || 'N/A'}
                       </td>
                       <td className="table-cell">
                         {busAsignado.conductor?.nombre || busAsignado.conductor_nombre || 'N/A'}
                       </td>
                      <td className="table-cell">
                        {busAsignado.numero_pasajeros || 0}
                      </td>
                      <td className="table-cell">
                        {formatDate(busAsignado.fecha_salida)}
                      </td>
                      <td className="table-cell">
                        {formatTime(busAsignado.fecha_salida)}
                      </td>
                      <td className="table-cell">
                        {formatDate(busAsignado.fecha_llegada)}
                      </td>
                      <td className="table-cell">
                        {formatTime(busAsignado.fecha_llegada)}
                      </td>
                      <td className="table-cell font-medium">
                        {formatCurrency(busAsignado.valor_bus || 0)}
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          busAsignado.fecha_llegada 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {busAsignado.fecha_llegada ? 'Completado' : 'En viaje'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(busAsignado)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(busAsignado.id)}
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
        )}
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <BusAsignacionForm
          planilla={planilla}
          busAsignado={editingBus}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default BusesPlanilla;
