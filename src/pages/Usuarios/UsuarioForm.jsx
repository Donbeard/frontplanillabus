import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coreAPI } from '../../services/api';

const UsuarioForm = ({ usuario, onClose, onSubmit }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [sitios, setSitios] = useState([]);
  const [sitiosFiltrados, setSitiosFiltrados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferenceData();
  }, []);

  // Efecto para cargar sitios filtrados cuando se está editando
  useEffect(() => {
    if (usuario && usuario.sitio?.ciudad?.id) {
      handleCiudadChange(usuario.sitio.ciudad.id.toString());
    }
  }, [usuario, sitios]);

  const loadReferenceData = async () => {
    try {
      const [tiposRes, ciudadesRes, sitiosRes, rolesRes] = await Promise.all([
        coreAPI.getTiposDocumentos(),
        coreAPI.getCiudades(),
        coreAPI.getSitios(),
        coreAPI.getRoles()
      ]);
      
      // Los datos vienen paginados, necesitamos acceder a .results
      setTiposDocumento(tiposRes.data.results || tiposRes.data);
      setCiudades(ciudadesRes.data.results || ciudadesRes.data);
      setSitios(sitiosRes.data.results || sitiosRes.data);
      setRoles(rolesRes.data.results || rolesRes.data);
    } catch (error) {
      console.error('Error cargando datos de referencia:', error);
      // En caso de error, establecer arrays vacíos para evitar errores
      setTiposDocumento([]);
      setCiudades([]);
      setSitios([]);
      setRoles([]);
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
    defaultValues: usuario ? {
      nombre: usuario.nombre || '',
      numero_documento: usuario.numero_documento || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || '',
      tipo_documento: usuario.id_tipo_documento?.toString() || usuario.tipo_documento?.id?.toString() || '',
      rol: usuario.id_rol?.toString() || usuario.rol?.id?.toString() || '',
      ciudad: usuario.id_sitio?.id_ciudad?.toString() || usuario.sitio?.ciudad?.id?.toString() || '',
      sitio: usuario.id_sitio?.toString() || usuario.sitio?.id?.toString() || '',
      activo: usuario.activo !== undefined ? usuario.activo : true
    } : {
      nombre: '',
      numero_documento: '',
      correo: '',
      telefono: '',
      tipo_documento: '',
      rol: '',
      ciudad: '',
      sitio: '',
      activo: true
    }
  });

  const onSubmitForm = (data) => {
    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_tipo_documento: parseInt(data.tipo_documento) || 1,
      id_sitio: parseInt(data.sitio),
      id_rol: parseInt(data.rol),
      contraseña: '123456', // Contraseña por defecto, se puede hacer dinámico
      telefono: data.telefono || null
    };
    
    // Eliminar campos que no van al backend
    delete transformedData.sitio;
    delete transformedData.rol;
    delete transformedData.tipo_documento;
    delete transformedData.ciudad;
    
    onSubmit(transformedData);
    reset();
  };

  const handleCiudadChange = (ciudadId) => {
    if (ciudadId) {
      const sitiosDeCiudad = sitios.filter(sitio => sitio.ciudad?.id === parseInt(ciudadId));
      setSitiosFiltrados(sitiosDeCiudad);
    } else {
      setSitiosFiltrados([]);
    }
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
              {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                {...register('nombre', { 
                  required: 'El nombre es requerido' 
                })}
                className="input-field"
                placeholder="Juan Pérez"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                {...register('tipo_documento', { 
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
              {errors.tipo_documento && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_documento.message}</p>
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
                  pattern: {
                    value: /^\d{8,12}$/,
                    message: 'Ingrese un número válido (8-12 dígitos)'
                  }
                })}
                className="input-field"
                placeholder="12345678"
              />
              {errors.numero_documento && (
                <p className="mt-1 text-sm text-red-600">{errors.numero_documento.message}</p>
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
                    message: 'Ingrese un correo válido'
                  }
                })}
                className="input-field"
                placeholder="juan@example.com"
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono', {
                  pattern: {
                    value: /^\d{7,10}$/,
                    message: 'Ingrese un teléfono válido'
                  }
                })}
                className="input-field"
                placeholder="3001234567"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <select
                {...register('ciudad', { 
                  required: 'La ciudad es requerida',
                  onChange: (e) => handleCiudadChange(e.target.value)
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
              {errors.ciudad && (
                <p className="mt-1 text-sm text-red-600">{errors.ciudad.message}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                {...register('rol', { 
                  required: 'El rol es requerido' 
                })}
                className="input-field"
              >
                <option value="">Seleccione un rol</option>
                {Array.isArray(roles) && roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
              )}
            </div>

            {/* Sitio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio *
              </label>
              <select
                {...register('sitio', { 
                  required: 'El sitio es requerido' 
                })}
                className="input-field"
                disabled={!sitiosFiltrados.length}
              >
                <option value="">Seleccione un sitio</option>
                {Array.isArray(sitiosFiltrados) && sitiosFiltrados.map((sitio) => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.nombre}
                  </option>
                ))}
              </select>
              {errors.sitio && (
                <p className="mt-1 text-sm text-red-600">{errors.sitio.message}</p>
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
                {usuario ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;
