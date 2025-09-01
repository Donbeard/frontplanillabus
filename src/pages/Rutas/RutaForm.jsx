import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coreAPI } from '../../services/api';

const RutaForm = ({ ruta, onClose, onSubmit }) => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCiudades();
  }, []);

  const loadCiudades = async () => {
    try {
      const response = await coreAPI.getCiudades();
      setCiudades(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando ciudades:', error);
      setCiudades([]);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: ruta ? {
      id_ciudad_origen: ruta.id_ciudad_origen?.toString() || ruta.ciudad_origen?.id?.toString() || '',
      id_ciudad_destino: ruta.id_ciudad_destino?.toString() || ruta.ciudad_destino?.id?.toString() || '',
      activo: ruta.activo !== undefined ? ruta.activo : true
    } : {
      id_ciudad_origen: '',
      id_ciudad_destino: '',
      activo: true
    }
  });

  const onSubmitForm = (data) => {
    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_ciudad_origen: parseInt(data.id_ciudad_origen),
      id_ciudad_destino: parseInt(data.id_ciudad_destino)
    };
    
    onSubmit(transformedData);
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
              {ruta ? 'Editar Ruta' : 'Nueva Ruta'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando ciudades...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              {/* Ciudad de Origen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad de Origen *
                </label>
                <select
                  {...register('id_ciudad_origen', {
                    required: 'La ciudad de origen es requerida'
                  })}
                  className="input-field"
                >
                  <option value="">Seleccione una ciudad</option>
                  {Array.isArray(ciudades) && ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_ciudad_origen && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_ciudad_origen.message}</p>
                )}
              </div>

              {/* Ciudad de Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad de Destino *
                </label>
                <select
                  {...register('id_ciudad_destino', {
                    required: 'La ciudad de destino es requerida'
                  })}
                  className="input-field"
                >
                  <option value="">Seleccione una ciudad</option>
                  {Array.isArray(ciudades) && ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_ciudad_destino && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_ciudad_destino.message}</p>
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
                  <span className="ml-2 text-sm text-gray-700">Activa</span>
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
                  {ruta ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RutaForm;
