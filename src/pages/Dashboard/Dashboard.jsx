import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  TruckIcon, 
  MapIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { usuariosAPI, busesAPI, rutasAPI, planillasAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usuarios: { count: 0, change: '+0%' },
    buses: { count: 0, change: '+0%' },
    rutas: { count: 0, change: '+0%' },
    planillas: { count: 0, change: '+0%' },
    ingresos: { amount: 0, change: '+0%' },
    tiquetes: { count: 0, change: '+0%' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [usuariosRes, busesRes, rutasRes, planillasRes] = await Promise.all([
        usuariosAPI.getAll(),
        busesAPI.getAll(),
        rutasAPI.getAll(),
        planillasAPI.getAll()
      ]);

      const usuarios = usuariosRes.data.results || usuariosRes.data;
      const buses = busesRes.data.results || busesRes.data;
      const rutas = rutasRes.data.results || rutasRes.data;
      const planillas = planillasRes.data.results || planillasRes.data;

      // Calcular estadísticas
      const totalIngresos = planillas.reduce((sum, planilla) => sum + (planilla.valor_total || 0), 0);
      const totalTiquetes = planillas.reduce((sum, planilla) => sum + (planilla.numero_tiquetes || 0), 0);

      setStats({
        usuarios: { count: usuarios.length, change: '+0%' },
        buses: { count: buses.length, change: '+0%' },
        rutas: { count: rutas.length, change: '+0%' },
        planillas: { count: planillas.length, change: '+0%' },
        ingresos: { amount: totalIngresos, change: '+0%' },
        tiquetes: { count: totalTiquetes, change: '+0%' }
      });

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { name: 'Total Usuarios', value: stats.usuarios.count.toString(), icon: UsersIcon, change: stats.usuarios.change, changeType: 'positive' },
    { name: 'Buses Activos', value: stats.buses.count.toString(), icon: TruckIcon, change: stats.buses.change, changeType: 'positive' },
    { name: 'Rutas Activas', value: stats.rutas.count.toString(), icon: MapIcon, change: stats.rutas.change, changeType: 'positive' },
    { name: 'Planillas Abiertas', value: stats.planillas.count.toString(), icon: ClipboardDocumentListIcon, change: stats.planillas.change, changeType: 'positive' },
    { name: 'Ingresos del Mes', value: `$${stats.ingresos.amount.toLocaleString()}`, icon: CurrencyDollarIcon, change: stats.ingresos.change, changeType: 'positive' },
    { name: 'Tiquetes Vendidos', value: stats.tiquetes.count.toString(), icon: ChartBarIcon, change: stats.tiquetes.change, changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, type: 'planilla', message: 'Nueva planilla creada', time: 'Hace 2 horas' },
    { id: 2, type: 'tiquete', message: 'Tiquete vendido', time: 'Hace 3 horas' },
    { id: 3, type: 'bus', message: 'Bus registrado', time: 'Hace 5 horas' },
    { id: 4, type: 'usuario', message: 'Usuario creado', time: 'Hace 1 día' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general del sistema PlanillaBus
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {statsData.map((item) => (
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
