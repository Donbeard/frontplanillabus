import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Usuarios = () => {
  const usuarios = [
    // Datos de ejemplo - se conectarán con la API
  ];

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
        <button className="btn-primary flex items-center">
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
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nombre</th>
                <th className="table-header-cell">Documento</th>
                <th className="table-header-cell">Correo</th>
                <th className="table-header-cell">Rol</th>
                <th className="table-header-cell">Sitio</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-cell text-center text-gray-500 py-8">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="table-row">
                    <td className="table-cell">{usuario.nombre}</td>
                    <td className="table-cell">{usuario.numero_documento}</td>
                    <td className="table-cell">{usuario.correo}</td>
                    <td className="table-cell">{usuario.rol}</td>
                    <td className="table-cell">{usuario.sitio}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                          Eliminar
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
  );
};

export default Usuarios;
