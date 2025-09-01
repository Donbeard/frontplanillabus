import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import UsuarioForm from './UsuarioForm';
import { usuariosAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';

const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.getAll();
      setUsuarios(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (usuario) => {
    try {
      // Obtener la información completa del usuario
      const response = await usuariosAPI.getById(usuario.id);
      setEditingUsuario(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información del usuario:', err);
      showError('Error al cargar la información del usuario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await usuariosAPI.delete(id);
        await loadUsuarios(); // Recargar la lista
        showSuccess('Usuario eliminado correctamente');
      } catch (err) {
        console.error('Error eliminando usuario:', err);
        showError('Error al eliminar el usuario');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const handleFormSubmit = async (usuarioData) => {
    try {
      if (editingUsuario) {
        // Actualizar usuario existente
        await usuariosAPI.update(editingUsuario.id, usuarioData);
        showSuccess('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await usuariosAPI.create(usuarioData);
        showSuccess('Usuario creado correctamente');
      }
      await loadUsuarios(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      showError('Error al guardar el usuario');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de usuarios del sistema
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando usuarios...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de usuarios del sistema
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadUsuarios}
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
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de usuarios del sistema
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Usuario
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
              placeholder="Buscar por nombre, documento..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select className="input-field">
              <option value="">Todos los roles</option>
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
              <option value="3">Conductor</option>
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
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="table">
                         <thead className="table-header">
               <tr>
                 <th className="table-header-cell">Nombre</th>
                 <th className="table-header-cell">Documento</th>
                 <th className="table-header-cell">Correo</th>
                 <th className="table-header-cell">Rol</th>
                 <th className="table-header-cell">Ciudad</th>
                 <th className="table-header-cell">Sitio</th>
                 <th className="table-header-cell">Estado</th>
                 <th className="table-header-cell">Acciones</th>
               </tr>
             </thead>
            <tbody className="table-body">
                             {usuarios.length === 0 ? (
                 <tr>
                   <td colSpan="8" className="table-cell text-center text-gray-500 py-8">
                     No hay usuarios registrados
                   </td>
                 </tr>
               ) : (
                usuarios.map((usuario) => (
                                     <tr key={usuario.id} className="table-row">
                     <td className="table-cell font-medium">{usuario.nombre}</td>
                     <td className="table-cell">{usuario.numero_documento}</td>
                     <td className="table-cell">{usuario.correo}</td>
                     <td className="table-cell">{usuario.rol?.nombre || 'N/A'}</td>
                     <td className="table-cell">{usuario.ciudad_nombre || usuario.sitio?.ciudad?.nombre || 'N/A'}</td>
                     <td className="table-cell">{usuario.sitio?.nombre || 'N/A'}</td>
                     <td className="table-cell">
                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                         usuario.activo === true || usuario.activo === undefined
                           ? 'bg-green-100 text-green-800' 
                           : 'bg-red-100 text-red-800'
                       }`}>
                         {usuario.activo === true || usuario.activo === undefined ? 'Activo' : 'Inactivo'}
                       </span>
                     </td>
                     <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(usuario)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
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
        <UsuarioForm
          usuario={editingUsuario}
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

export default Usuarios;
