import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Buses = () => {
  const buses = [
    // Datos de ejemplo - se conectarán con la API
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de buses y conductores
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Bus
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
              placeholder="Buscar por placa, modelo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="input-field">
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad
            </label>
            <select className="input-field">
              <option value="">Todas</option>
              <option value="30">30+ pasajeros</option>
              <option value="40">40+ pasajeros</option>
              <option value="50">50+ pasajeros</option>
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
                <th className="table-header-cell">Placa</th>
                <th className="table-header-cell">Modelo</th>
                <th className="table-header-cell">Capacidad</th>
                <th className="table-header-cell">SOAT</th>
                <th className="table-header-cell">Técnico</th>
                <th className="table-header-cell">Estado</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {buses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center text-gray-500 py-8">
                    No hay buses registrados
                  </td>
                </tr>
              ) : (
                buses.map((bus) => (
                  <tr key={bus.id} className="table-row">
                    <td className="table-cell">{bus.placa}</td>
                    <td className="table-cell">{bus.modelo}</td>
                    <td className="table-cell">{bus.capacidad}</td>
                    <td className="table-cell">{bus.fecha_soat}</td>
                    <td className="table-cell">{bus.fecha_tecno}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bus.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bus.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
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

export default Buses;
