import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BusForm = ({ bus, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: bus || {
      placa: '',
      modelo: '',
      capacidad: '',
      fecha_soat: '',
      fecha_tecno: '',
      activo: true
    }
  });

  // Función para convertir placa a mayúsculas
  const handlePlacaChange = (e) => {
    const value = e.target.value.toUpperCase();
    setValue('placa', value);
  };

  const onSubmitForm = (data) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {bus ? 'Editar Bus' : 'Nuevo Bus'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa *
              </label>
              <input
                type="text"
                {...register('placa', { 
                  required: 'La placa es requerida',
                  pattern: {
                    value: /^[A-Z]{3}\d{3}$/,
                    message: 'Formato: ABC123'
                  }
                })}
                onChange={handlePlacaChange}
                className="input-field"
                placeholder="ABC123"
              />
              {errors.placa && (
                <p className="mt-1 text-sm text-red-600">{errors.placa.message}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                {...register('modelo', { 
                  required: 'El modelo es requerido' 
                })}
                className="input-field"
                placeholder="Mercedes Benz O500"
              />
              {errors.modelo && (
                <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
              )}
            </div>

            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad (pasajeros) *
              </label>
              <input
                type="number"
                {...register('capacidad', { 
                  required: 'La capacidad es requerida',
                  min: { value: 1, message: 'Mínimo 1 pasajero' },
                  max: { value: 100, message: 'Máximo 100 pasajeros' }
                })}
                className="input-field"
                placeholder="45"
              />
              {errors.capacidad && (
                <p className="mt-1 text-sm text-red-600">{errors.capacidad.message}</p>
              )}
            </div>

            {/* Fecha SOAT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha SOAT *
              </label>
              <input
                type="date"
                {...register('fecha_soat', { 
                  required: 'La fecha SOAT es requerida' 
                })}
                className="input-field"
              />
              {errors.fecha_soat && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_soat.message}</p>
              )}
            </div>

            {/* Fecha Técnico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Técnico *
              </label>
              <input
                type="date"
                {...register('fecha_tecno', { 
                  required: 'La fecha técnico es requerida' 
                })}
                className="input-field"
              />
              {errors.fecha_tecno && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_tecno.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('activo')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Activo</span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {bus ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusForm;
