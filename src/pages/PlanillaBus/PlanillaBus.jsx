import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { planillaBusAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';

const PlanillaBus = () => {
  const [planillasBus, setPlanillasBus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    planilla: '',
    bus: '',
    conductor: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadPlanillasBus();
  }, []);

  const loadPlanillasBus = async () => {
    try {
      setLoading(true);
      const response = await planillaBusAPI.getAll();
      setPlanillasBus(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando planillas de buses:', error);
      showNotification('Error cargando planillas de buses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Filtrar datos
  const filteredData = planillasBus.filter(item => {
    const searchMatch = !filters.search || 
      item.bus?.placa?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.conductor?.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.id_planilla?.prefijo?.toLowerCase().includes(filters.search.toLowerCase());
    
    const planillaMatch = !filters.planilla || 
      item.id_planilla?.prefijo === filters.planilla;
    
    const busMatch = !filters.bus || 
      item.bus?.placa === filters.bus;
    
    const conductorMatch = !filters.conductor || 
      item.conductor?.nombre === filters.conductor;
    
    return searchMatch && planillaMatch && busMatch && conductorMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Estadísticas
  const estadisticas = {
    total: planillasBus.length,
    totalValor: planillasBus.reduce((sum, item) => sum + (parseFloat(item.valor_bus) || 0), 0),
    promedioValor: planillasBus.length > 0 ? 
      planillasBus.reduce((sum, item) => sum + (parseFloat(item.valor_bus) || 0), 0) / planillasBus.length : 0,
    totalPasajeros: planillasBus.reduce((sum, item) => sum + (parseInt(item.numero_pasajeros) || 0), 0)
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes de Planillas de Buses</h1>
          <p className="text-gray-600">Gestión y seguimiento de buses asignados a planillas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda general */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por bus, conductor, planilla..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filtro por planilla */}
          <div>
            <select
              value={filters.planilla}
              onChange={(e) => handleFilterChange('planilla', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las planillas</option>
              {Array.from(new Set(planillasBus.map(item => item.id_planilla?.prefijo))).map(prefijo => (
                <option key={prefijo} value={prefijo}>{prefijo}</option>
              ))}
            </select>
          </div>

          {/* Filtro por bus */}
          <div>
            <select
              value={filters.bus}
              onChange={(e) => handleFilterChange('bus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los buses</option>
              {Array.from(new Set(planillasBus.map(item => item.bus?.placa))).map(placa => (
                <option key={placa} value={placa}>{placa}</option>
              ))}
            </select>
          </div>

          {/* Filtro por conductor */}
          <div>
            <select
              value={filters.conductor}
              onChange={(e) => handleFilterChange('conductor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los conductores</option>
              {Array.from(new Set(planillasBus.map(item => item.conductor?.nombre))).map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Planillas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.totalValor)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Bus</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.promedioValor)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pasajeros</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.totalPasajeros}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        ) : (
          <>
            <div className="table-scroll-container">
              <div className="table-container">
                <table className="table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Planilla
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conductor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasajeros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Salida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Llegada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Bus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((planillaBus) => (
                    <tr key={planillaBus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {planillaBus.id_planilla?.prefijo}-{planillaBus.id_planilla?.num_planilla}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {planillaBus.bus?.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {planillaBus.conductor?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {planillaBus.numero_pasajeros || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(planillaBus.fecha_salida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(planillaBus.fecha_llegada)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(planillaBus.valor_bus || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          planillaBus.fecha_llegada 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {planillaBus.fecha_llegada ? 'Completado' : 'En viaje'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Paginación */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Mostrar</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-700">por página</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de{' '}
                    <span className="font-medium">{filteredData.length}</span> resultados
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Primera página</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Página anterior</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de{' '}
                    <span className="font-medium">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Página siguiente</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Última página</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanillaBus;
