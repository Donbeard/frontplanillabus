import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { busesAPI, conductoresAPI } from '../../services/api';

const BusAsignacionForm = ({ planilla, busAsignado, onClose, onSubmit }) => {
  const [buses, setBuses] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const isEditing = !!busAsignado;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (busAsignado) {
      console.log('Cargando datos del bus asignado:', busAsignado);
      
      // Llenar el formulario con los datos existentes
      // Intentar con la nueva estructura primero, luego con la antigua como fallback
      const busId = busAsignado.bus?.id || busAsignado.id_bus;
      const conductorId = busAsignado.conductor?.id || busAsignado.id_conductor;
      
      setValue('id_bus', busId);
      setValue('id_conductor', conductorId);
      setValue('numero_pasajeros', busAsignado.numero_pasajeros || 0);
      
      if (busAsignado.fecha_salida) {
        const fechaSalida = new Date(busAsignado.fecha_salida);
        setValue('fecha_salida', fechaSalida.toISOString().split('T')[0]);
        setValue('hora_salida', fechaSalida.toTimeString().substring(0, 5));
      }
      
      if (busAsignado.fecha_llegada) {
        const fechaLlegada = new Date(busAsignado.fecha_llegada);
        setValue('fecha_llegada', fechaLlegada.toISOString().split('T')[0]);
        setValue('hora_llegada', fechaLlegada.toTimeString().substring(0, 5));
      }
      
      console.log('Datos cargados en el formulario:', {
        id_bus: busId,
        id_conductor: conductorId,
        numero_pasajeros: busAsignado.numero_pasajeros,
        fecha_salida: busAsignado.fecha_salida,
        fecha_llegada: busAsignado.fecha_llegada
      });
    } else {
      // Para nueva asignación, establecer la fecha actual
      const today = new Date().toISOString().split('T')[0];
      setValue('fecha_salida', today);
      setValue('numero_pasajeros', 0);
      console.log('Nueva asignación - fecha actual:', today);
    }
  }, [busAsignado, setValue]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [busesResponse, conductoresResponse] = await Promise.all([
        busesAPI.getAll(),
        conductoresAPI.getAll()
      ]);
      
      setBuses(busesResponse.data.results || busesResponse.data);
      setConductores(conductoresResponse.data.results || conductoresResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmitForm = async (data) => {
    try {
      setLoading(true);
      
      console.log('Datos del formulario antes de procesar:', data);
      
      // Combinar fecha y hora de salida
      let fechaSalida = null;
      if (data.fecha_salida && data.hora_salida) {
        fechaSalida = new Date(`${data.fecha_salida}T${data.hora_salida}:00`);
      }
      
      // Combinar fecha y hora de llegada
      let fechaLlegada = null;
      if (data.fecha_llegada && data.hora_llegada) {
        fechaLlegada = new Date(`${data.fecha_llegada}T${data.hora_llegada}:00`);
      }
      
      const formData = {
        id_planilla: planilla.id,
        id_bus: data.id_bus,
        id_conductor: data.id_conductor,
        numero_pasajeros: parseInt(data.numero_pasajeros) || 0,
        fecha_salida: fechaSalida,
        fecha_llegada: fechaLlegada
      };
      
      console.log('Datos a enviar al backend:', formData);
      console.log('¿Es edición?', isEditing);
      console.log('ID del bus asignado a editar:', busAsignado?.id);
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en el formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Asignación de Bus' : 'Asignar Bus a Planilla'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Información de la planilla */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Planilla</h3>
            <p className="text-lg font-semibold text-gray-900">
              {planilla.prefijo}-{planilla.num_planilla}
            </p>
            <p className="text-sm text-gray-600">
              {planilla.ruta?.ciudad_origen?.nombre} - {planilla.ruta?.ciudad_destino?.nombre}
            </p>
            <p className="text-sm text-gray-600">
              Valor: ${parseFloat(planilla.valor_planilla || 0).toLocaleString()}
            </p>
          </div>

          {/* Panel de depuración - Solo mostrar en desarrollo */}
          {process.env.NODE_ENV === 'development' && busAsignado && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">🔍 Información de Depuración</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>ID del bus asignado:</strong> {busAsignado.id}</p>
                <p><strong>Bus ID:</strong> {busAsignado.bus?.id || busAsignado.id_bus} - {busAsignado.bus?.placa || busAsignado.bus_placa}</p>
                <p><strong>Conductor ID:</strong> {busAsignado.conductor?.id || busAsignado.id_conductor} - {busAsignado.conductor?.nombre || busAsignado.conductor_nombre}</p>
                <p><strong>Pasajeros:</strong> {busAsignado.numero_pasajeros}</p>
                <p><strong>Fecha salida:</strong> {busAsignado.fecha_salida}</p>
                <p><strong>Fecha llegada:</strong> {busAsignado.fecha_llegada || 'No registrada'}</p>
                <p><strong>Valor bus:</strong> ${parseFloat(busAsignado.valor_bus || 0).toLocaleString()}</p>
                <p><strong>Estructura de datos:</strong> {busAsignado.bus ? 'Nueva (anidada)' : 'Antigua (plana)'}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Bus */}
             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus * {(busAsignado?.bus?.placa || busAsignado?.bus_placa) && (
                    <span className="text-green-600 text-xs ml-2">✓ Cargado: {busAsignado.bus?.placa || busAsignado.bus_placa}</span>
                  )}
                </label>
               <select
                 {...register('id_bus', { required: 'Selecciona un bus' })}
                 className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                   errors.id_bus ? 'border-red-500' : 'border-gray-300'
                 }`}
               >
                 <option value="">Seleccionar bus</option>
                 {buses.map((bus) => (
                   <option key={bus.id} value={bus.id}>
                     {bus.placa} - {bus.marca} {bus.modelo}
                   </option>
                 ))}
               </select>
               {errors.id_bus && (
                 <p className="mt-1 text-sm text-red-600">{errors.id_bus.message}</p>
               )}
             </div>

                         {/* Conductor */}
             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conductor * {(busAsignado?.conductor?.nombre || busAsignado?.conductor_nombre) && (
                    <span className="text-green-600 text-xs ml-2">✓ Cargado: {busAsignado.conductor?.nombre || busAsignado.conductor_nombre}</span>
                  )}
                </label>
               <select
                 {...register('id_conductor', { required: 'Selecciona un conductor' })}
                 className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                   errors.id_conductor ? 'border-red-500' : 'border-gray-300'
                 }`}
               >
                 <option value="">Seleccionar conductor</option>
                 {conductores.map((conductor) => (
                   <option key={conductor.id} value={conductor.id}>
                     {conductor.nombre} - {conductor.numero_documento}
                   </option>
                 ))}
               </select>
               {errors.id_conductor && (
                 <p className="mt-1 text-sm text-red-600">{errors.id_conductor.message}</p>
               )}
             </div>

                         {/* Número de pasajeros */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Número de Pasajeros {busAsignado?.numero_pasajeros !== undefined && (
                   <span className="text-green-600 text-xs ml-2">✓ Cargado: {busAsignado.numero_pasajeros}</span>
                 )}
               </label>
               <input
                 type="number"
                 min="0"
                 {...register('numero_pasajeros', { 
                   min: { value: 0, message: 'El número de pasajeros debe ser mayor o igual a 0' }
                 })}
                 className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                   errors.numero_pasajeros ? 'border-red-500' : 'border-gray-300'
                 }`}
                 placeholder="0"
               />
               {errors.numero_pasajeros && (
                 <p className="mt-1 text-sm text-red-600">{errors.numero_pasajeros.message}</p>
               )}
             </div>

            {/* Fecha de salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Salida *
              </label>
              <input
                type="date"
                {...register('fecha_salida', { required: 'Selecciona la fecha de salida' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.fecha_salida ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_salida && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_salida.message}</p>
              )}
            </div>

            {/* Hora de salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Salida *
              </label>
              <input
                type="time"
                {...register('hora_salida', { required: 'Selecciona la hora de salida' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.hora_salida ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hora_salida && (
                <p className="mt-1 text-sm text-red-600">{errors.hora_salida.message}</p>
              )}
            </div>

            {/* Fecha de llegada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Llegada
              </label>
              <input
                type="date"
                {...register('fecha_llegada')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Hora de llegada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Llegada
              </label>
              <input
                type="time"
                {...register('hora_llegada')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Asignar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusAsignacionForm;
