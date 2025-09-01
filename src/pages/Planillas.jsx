import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Planillas = () => {
  const planillas = [
    // Datos de ejemplo - se conectarán con la API
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planillas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de planillas y tiquetes
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Planilla
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Buscar por número, prefijo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todos</option>
              <option value="1">Abierta</option>
              <option value="2">Cerrada</option>
              <option value="3">Anulada</option>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Número</th>
                <th className="table-header-cell">Sitio</th>
                <th className="table-header-cell">Ruta</th>
                <th className="table-header-cell">Usuario</th>
                <th className="table-header-cell">Fecha</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {planillas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell text-center text-gray-500 py-8">
                    No hay planillas registradas
                  </td>
                </tr>
              ) : (
                planillas.map((planilla) => (
                  <tr key={planilla.id} className="table-row">
                    <td className="table-cell">{planilla.numero}</td>
                    <td className="table-cell">{planilla.sitio}</td>
                    <td className="table-cell">{planilla.ruta}</td>
                    <td className="table-cell">{planilla.usuario}</td>
                    <td className="table-cell">{planilla.fecha}</td>
                    <td className="table-cell">${planilla.valor}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        planilla.estado === 1 
                          ? 'bg-green-100 text-green-800'
                          : planilla.estado === 2
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {planilla.estado === 1 ? 'Abierta' : planilla.estado === 2 ? 'Cerrada' : 'Anulada'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                          Ver
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Tiquetes
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                          Buses
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

export default Planillas;
