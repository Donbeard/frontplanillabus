import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coreAPI, usuariosAPI, rutasAPI } from '../../services/api';

const PlanillaForm = ({ planilla, onClose, onSubmit }) => {
  const [sitios, setSitios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      setLoading(true);
      const [sitiosRes, usuariosRes, rutasRes] = await Promise.all([
        coreAPI.getSitios(),
        usuariosAPI.getAll(),
        rutasAPI.getAll()
      ]);

      setSitios(sitiosRes.data.results || sitiosRes.data);
      setUsuarios(usuariosRes.data.results || usuariosRes.data);
      setRutas(rutasRes.data.results || rutasRes.data);
    } catch (error) {
      console.error('Error cargando datos de referencia:', error);
      setSitios([]);
      setUsuarios([]);
      setRutas([]);
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
    defaultValues: planilla ? {
      num_planilla: planilla.num_planilla || '',
      prefijo: planilla.prefijo || '',
      id_sitio: planilla.id_sitio?.toString() || planilla.sitio?.id?.toString() || '',
      id_usuario: planilla.id_usuario?.toString() || planilla.usuario?.id?.toString() || '',
      id_ruta: planilla.id_ruta?.toString() || planilla.ruta?.id?.toString() || '',
      fecha_creacion: planilla.fecha_creacion || '',
      fecha_cierre: planilla.fecha_cierre || '',
      valor_planilla: planilla.valor_planilla || '',
      cuenta_contable_recibido: planilla.cuenta_contable_recibido || '',
      estado: planilla.estado || 1
    } : {
      num_planilla: '',
      prefijo: '',
      id_sitio: '',
      id_usuario: '',
      id_ruta: '',
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_cierre: '',
      valor_planilla: '',
      cuenta_contable_recibido: '',
      estado: 1
    }
  });

  const onSubmitForm = (data) => {
    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_sitio: parseInt(data.id_sitio),
      id_usuario: parseInt(data.id_usuario),
      id_ruta: parseInt(data.id_ruta),
      valor_planilla: parseFloat(data.valor_planilla) || 0,
      cuenta_contable_recibido: parseInt(data.cuenta_contable_recibido) || 0,
      estado: parseInt(data.estado)
    };

    // Si no hay fecha de cierre, establecer como null
    if (!data.fecha_cierre) {
      transformedData.fecha_cierre = null;
    }

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
              {planilla ? 'Editar Planilla' : 'Nueva Planilla'}
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
                {/* Número de Planilla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Planilla *
                  </label>
                  <input
                    type="number"
                    {...register('num_planilla', {
                      required: 'El número de planilla es requerido',
                      min: { value: 1, message: 'El número debe ser mayor a 0' }
                    })}
                    className="input-field"
                    placeholder="12345"
                  />
                  {errors.num_planilla && (
                    <p className="mt-1 text-sm text-red-600">{errors.num_planilla.message}</p>
                  )}
                </div>

                {/* Prefijo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prefijo *
                  </label>
                  <input
                    type="text"
                    {...register('prefijo', {
                      required: 'El prefijo es requerido',
                      maxLength: { value: 10, message: 'Máximo 10 caracteres' }
                    })}
                    className="input-field"
                    placeholder="PLA"
                  />
                  {errors.prefijo && (
                    <p className="mt-1 text-sm text-red-600">{errors.prefijo.message}</p>
                  )}
                </div>

                {/* Sitio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sitio *
                  </label>
                  <select
                    {...register('id_sitio', {
                      required: 'El sitio es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un sitio</option>
                    {Array.isArray(sitios) && sitios.map((sitio) => (
                      <option key={sitio.id} value={sitio.id}>
                        {sitio.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_sitio && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_sitio.message}</p>
                  )}
                </div>

                {/* Usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario *
                  </label>
                  <select
                    {...register('id_usuario', {
                      required: 'El usuario es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un usuario</option>
                    {Array.isArray(usuarios) && usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_usuario && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_usuario.message}</p>
                  )}
                </div>

                {/* Ruta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ruta *
                  </label>
                  <select
                    {...register('id_ruta', {
                      required: 'La ruta es requerida'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione una ruta</option>
                    {Array.isArray(rutas) && rutas.map((ruta) => (
                      <option key={ruta.id} value={ruta.id}>
                        {ruta.ciudad_origen?.nombre} - {ruta.ciudad_destino?.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_ruta && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_ruta.message}</p>
                  )}
                </div>

                {/* Fecha de Creación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Creación *
                  </label>
                  <input
                    type="date"
                    {...register('fecha_creacion', {
                      required: 'La fecha de creación es requerida'
                    })}
                    className="input-field"
                  />
                  {errors.fecha_creacion && (
                    <p className="mt-1 text-sm text-red-600">{errors.fecha_creacion.message}</p>
                  )}
                </div>

                {/* Fecha de Cierre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Cierre
                  </label>
                  <input
                    type="date"
                    {...register('fecha_cierre')}
                    className="input-field"
                  />
                </div>

                {/* Valor de la Planilla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de la Planilla
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('valor_planilla', {
                      min: { value: 0, message: 'El valor debe ser mayor o igual a 0' }
                    })}
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.valor_planilla && (
                    <p className="mt-1 text-sm text-red-600">{errors.valor_planilla.message}</p>
                  )}
                </div>

                {/* Cuenta Contable Recibido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuenta Contable Recibido *
                  </label>
                  <input
                    type="number"
                    {...register('cuenta_contable_recibido', {
                      required: 'La cuenta contable es requerida',
                      min: { value: 1, message: 'La cuenta debe ser mayor a 0' }
                    })}
                    className="input-field"
                    placeholder="123456"
                  />
                  {errors.cuenta_contable_recibido && (
                    <p className="mt-1 text-sm text-red-600">{errors.cuenta_contable_recibido.message}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    {...register('estado', {
                      required: 'El estado es requerido'
                    })}
                    className="input-field"
                  >
                    <option value={1}>Abierta</option>
                    <option value={2}>En venta</option>
                    <option value={3}>Cerrada</option>
                    <option value={4}>Anulada</option>
                  </select>
                  {errors.estado && (
                    <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
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
                  {planilla ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanillaForm;
