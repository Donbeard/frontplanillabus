import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  MapIcon, 
  ClipboardDocumentListIcon,
  TicketIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Usuarios', href: '/usuarios', icon: UsersIcon },
    { name: 'Buses', href: '/buses', icon: TruckIcon },
    { name: 'Rutas', href: '/rutas', icon: MapIcon },
    { name: 'Planillas', href: '/planillas', icon: ClipboardDocumentListIcon },
    { name: 'Tiquetes', href: '/tiquetes', icon: TicketIcon },
    { name: 'Planillas Bus', href: '/planilla-bus', icon: ChartBarIcon },
    { name: 'Distribuciones', href: '/planilla-distribucion', icon: CurrencyDollarIcon },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para móviles */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-50 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">PlanillaBus</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`mr-2 h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-50 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-14 items-center px-3">
            <h1 className="text-base font-bold text-gray-900">PlanillaBus</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-2 h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-50">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Perfil de usuario */}
              <div className="flex items-center gap-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la página */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
