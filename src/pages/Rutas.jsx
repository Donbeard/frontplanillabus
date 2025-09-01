import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Rutas = () => {
  const rutas = [
    // Datos de ejemplo - se conectarán con la API
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de rutas y perfiles de horarios
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Ruta
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
              placeholder="Buscar por origen, destino..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todas</option>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origen
            </label>
            <select className="input-field">
              <option value="">Todas las ciudades</option>
              <option value="1">Medellín</option>
              <option value="2">Bogotá</option>
              <option value="3">Cali</option>
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
                <th className="table-header-cell">Origen</th>
                <th className="table-header-cell">Destino</th>
                <th className="table-header-cell">Perfiles</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {rutas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-cell text-center text-gray-500 py-8">
                    No hay rutas registradas
                  </td>
                </tr>
              ) : (
                rutas.map((ruta) => (
                  <tr key={ruta.id} className="table-row">
                    <td className="table-cell">{ruta.origen}</td>
                    <td className="table-cell">{ruta.destino}</td>
                    <td className="table-cell">{ruta.perfiles}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ruta.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ruta.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                          Editar
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Perfiles
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

export default Rutas;
