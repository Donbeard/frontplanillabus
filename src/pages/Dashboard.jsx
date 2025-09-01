import React from 'react';
import { 
  UsersIcon, 
  TruckIcon, 
  MapIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    { name: 'Total Usuarios', value: '0', icon: UsersIcon, change: '+0%', changeType: 'positive' },
    { name: 'Buses Activos', value: '0', icon: TruckIcon, change: '+0%', changeType: 'positive' },
    { name: 'Rutas Activas', value: '0', icon: MapIcon, change: '+0%', changeType: 'positive' },
    { name: 'Planillas Abiertas', value: '0', icon: ClipboardDocumentListIcon, change: '+0%', changeType: 'positive' },
    { name: 'Ingresos del Mes', value: '$0', icon: CurrencyDollarIcon, change: '+0%', changeType: 'positive' },
    { name: 'Tiquetes Vendidos', value: '0', icon: ChartBarIcon, change: '+0%', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, type: 'planilla', message: 'Nueva planilla creada', time: 'Hace 2 horas' },
    { id: 2, type: 'tiquete', message: 'Tiquete vendido', time: 'Hace 3 horas' },
    { id: 3, type: 'bus', message: 'Bus registrado', time: 'Hace 5 horas' },
    { id: 4, type: 'usuario', message: 'Usuario creado', time: 'Hace 1 día' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general del sistema PlanillaBus
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actividad Reciente */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {activity.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button className="card p-4 text-left hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Nueva Planilla</p>
              <p className="text-xs text-gray-500">Crear planilla de transporte</p>
            </div>
          </div>
        </button>

        <button className="card p-4 text-left hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Nuevo Usuario</p>
              <p className="text-xs text-gray-500">Registrar nuevo usuario</p>
            </div>
          </div>
        </button>

        <button className="card p-4 text-left hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Nuevo Bus</p>
              <p className="text-xs text-gray-500">Registrar nuevo bus</p>
            </div>
          </div>
        </button>

        <button className="card p-4 text-left hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <MapIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Nueva Ruta</p>
              <p className="text-xs text-gray-500">Crear nueva ruta</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
