import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coreAPI, usuariosAPI, perfilesRutasAPI } from '../../services/api';

const TiqueteForm = ({ tiquete, planilla, onClose, onSubmit }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [perfilesRuta, setPerfilesRuta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferenceData();
  }, [planilla]);

  const loadReferenceData = async () => {
    try {
      setLoading(true);
      const [tiposDocRes, vendedoresRes] = await Promise.all([
        coreAPI.getTiposDocumentos(),
        usuariosAPI.getAll()
      ]);

      setTiposDocumento(tiposDocRes.data.results || tiposDocRes.data);
      setVendedores(vendedoresRes.data.results || vendedoresRes.data);

      // Cargar perfiles de ruta si hay una planilla
      if (planilla?.id_ruta) {
        try {
          const perfilesRes = await perfilesRutasAPI.getByRuta(planilla.id_ruta);
          setPerfilesRuta(perfilesRes.data.results || perfilesRes.data);
        } catch (error) {
          console.error('Error cargando perfiles de ruta:', error);
          setPerfilesRuta([]);
        }
      }
    } catch (error) {
      console.error('Error cargando datos de referencia:', error);
      setTiposDocumento([]);
      setVendedores([]);
      setPerfilesRuta([]);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: tiquete ? {
      id_tipo_documento: tiquete.id_tipo_documento?.toString() || '',
      numero_documento: tiquete.numero_documento || '',
      nombre: tiquete.nombre || '',
      correo: tiquete.correo || '',
      num_asientos: tiquete.num_asientos || 1,
      id_planilla: tiquete.id_planilla?.toString() || planilla?.id?.toString() || '',
      id_perfil_ruta: tiquete.id_perfil_ruta?.toString() || '',
      id_vendedor: tiquete.id_vendedor?.toString() || '',
      valor_unitario: tiquete.valor_unitario || '',
      total: tiquete.total || ''
    } : {
      id_tipo_documento: '',
      numero_documento: '',
      nombre: '',
      correo: '',
      num_asientos: 1,
      id_planilla: planilla?.id?.toString() || '',
      id_perfil_ruta: '',
      id_vendedor: '',
      valor_unitario: '',
      total: ''
    }
  });

  // Observar cambios en num_asientos y valor_unitario para calcular total
  const numAsientos = watch('num_asientos');
  const valorUnitario = watch('valor_unitario');

  useEffect(() => {
    if (numAsientos && valorUnitario) {
      const total = parseFloat(numAsientos) * parseFloat(valorUnitario);
      if (!isNaN(total)) {
        // Actualizar el campo total
        const totalField = document.querySelector('input[name="total"]');
        if (totalField) {
          totalField.value = total.toFixed(2);
        }
      }
    }
  }, [numAsientos, valorUnitario]);

  const onSubmitForm = (data) => {
    // Calcular total si no está definido
    if (!data.total && data.num_asientos && data.valor_unitario) {
      data.total = parseFloat(data.num_asientos) * parseFloat(data.valor_unitario);
    }

    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_tipo_documento: parseInt(data.id_tipo_documento),
      id_planilla: parseInt(data.id_planilla),
      id_perfil_ruta: parseInt(data.id_perfil_ruta),
      id_vendedor: parseInt(data.id_vendedor),
      num_asientos: parseInt(data.num_asientos),
      valor_unitario: parseFloat(data.valor_unitario) || 0,
      total: parseFloat(data.total) || 0
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
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {tiquete ? 'Editar Tiquete' : 'Nuevo Tiquete'}
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
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    {...register('id_tipo_documento', {
                      required: 'El tipo de documento es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un tipo</option>
                    {Array.isArray(tiposDocumento) && tiposDocumento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre_tipo_documento}
                      </option>
                    ))}
                  </select>
                  {errors.id_tipo_documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_tipo_documento.message}</p>
                  )}
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    {...register('numero_documento', {
                      required: 'El número de documento es requerido',
                      maxLength: { value: 20, message: 'Máximo 20 caracteres' }
                    })}
                    className="input-field"
                    placeholder="12345678"
                  />
                  {errors.numero_documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_documento.message}</p>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Pasajero *
                  </label>
                  <input
                    type="text"
                    {...register('nombre', {
                      required: 'El nombre es requerido',
                      maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                    })}
                    className="input-field"
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    {...register('correo', {
                      required: 'El correo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electrónico inválido'
                      }
                    })}
                    className="input-field"
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.correo && (
                    <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
                  )}
                </div>

                {/* Número de Asientos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Asientos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('num_asientos', {
                      required: 'El número de asientos es requerido',
                      min: { value: 1, message: 'Mínimo 1 asiento' }
                    })}
                    className="input-field"
                    placeholder="1"
                  />
                  {errors.num_asientos && (
                    <p className="mt-1 text-sm text-red-600">{errors.num_asientos.message}</p>
                  )}
                </div>

                {/* Perfil de Ruta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil de Ruta *
                  </label>
                  <select
                    {...register('id_perfil_ruta', {
                      required: 'El perfil de ruta es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un perfil</option>
                    {Array.isArray(perfilesRuta) && perfilesRuta.map((perfil) => (
                      <option key={perfil.id} value={perfil.id}>
                        {perfil.dias_semana?.join(', ')} - {perfil.hora_inicio} a {perfil.hora_fin} - ${perfil.valor}
                      </option>
                    ))}
                  </select>
                  {errors.id_perfil_ruta && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_perfil_ruta.message}</p>
                  )}
                </div>

                {/* Vendedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendedor *
                  </label>
                  <select
                    {...register('id_vendedor', {
                      required: 'El vendedor es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un vendedor</option>
                    {Array.isArray(vendedores) && vendedores.map((vendedor) => (
                      <option key={vendedor.id} value={vendedor.id}>
                        {vendedor.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_vendedor && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_vendedor.message}</p>
                  )}
                </div>

                {/* Valor Unitario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Unitario *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('valor_unitario', {
                      required: 'El valor unitario es requerido',
                      min: { value: 0, message: 'El valor debe ser mayor o igual a 0' }
                    })}
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.valor_unitario && (
                    <p className="mt-1 text-sm text-red-600">{errors.valor_unitario.message}</p>
                  )}
                </div>

                {/* Total */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('total', {
                      required: 'El total es requerido',
                      min: { value: 0, message: 'El total debe ser mayor o igual a 0' }
                    })}
                    className="input-field"
                    placeholder="0.00"
                    readOnly
                  />
                  {errors.total && (
                    <p className="mt-1 text-sm text-red-600">{errors.total.message}</p>
                  )}
                </div>
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
                  {tiquete ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TiqueteForm;
