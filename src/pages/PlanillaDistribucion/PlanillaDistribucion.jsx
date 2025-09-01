import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { planillaDistribucionAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';

const PlanillaDistribucion = () => {
  const [distribuciones, setDistribuciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    planillaBus: '',
    propietario: '',
    bus: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadDistribuciones();
  }, []);

  const loadDistribuciones = async () => {
    try {
      setLoading(true);
      const response = await planillaDistribucionAPI.getAll();
      setDistribuciones(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando distribuciones:', error);
      showNotification('Error cargando distribuciones', 'error');
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
  const filteredData = distribuciones.filter(item => {
    const searchMatch = !filters.search || 
      item.bus_propietario?.id_propietario?.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.bus_propietario?.id_bus?.placa?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.id_planilla_bus?.id_planilla?.prefijo?.toLowerCase().includes(filters.search.toLowerCase());
    
    const planillaBusMatch = !filters.planillaBus || 
      item.id_planilla_bus?.id_planilla?.prefijo === filters.planillaBus;
    
    const propietarioMatch = !filters.propietario || 
      item.bus_propietario?.id_propietario?.nombre === filters.propietario;
    
    const busMatch = !filters.bus || 
      item.bus_propietario?.id_bus?.placa === filters.bus;
    
    return searchMatch && planillaBusMatch && propietarioMatch && busMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Estadísticas
  const estadisticas = {
    total: distribuciones.length,
    totalValor: distribuciones.reduce((sum, item) => sum + (parseFloat(item.valor_aplicado) || 0), 0),
    promedioValor: distribuciones.length > 0 ? 
      distribuciones.reduce((sum, item) => sum + (parseFloat(item.valor_aplicado) || 0), 0) / distribuciones.length : 0,
    promedioPorcentaje: distribuciones.length > 0 ? 
      distribuciones.reduce((sum, item) => sum + (parseFloat(item.porcentaje_aplicado) || 0), 0) / distribuciones.length : 0
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

  const formatPercentage = (value) => {
    return `${parseFloat(value || 0).toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes de Distribución de Propietarios</h1>
          <p className="text-gray-600">Gestión y seguimiento de distribución de ingresos entre propietarios</p>
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
              placeholder="Buscar por propietario, bus, planilla..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filtro por planilla */}
          <div>
            <select
              value={filters.planillaBus}
              onChange={(e) => handleFilterChange('planillaBus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las planillas</option>
              {Array.from(new Set(distribuciones.map(item => item.id_planilla_bus?.id_planilla?.prefijo))).map(prefijo => (
                <option key={prefijo} value={prefijo}>{prefijo}</option>
              ))}
            </select>
          </div>

          {/* Filtro por propietario */}
          <div>
            <select
              value={filters.propietario}
              onChange={(e) => handleFilterChange('propietario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los propietarios</option>
              {Array.from(new Set(distribuciones.map(item => item.bus_propietario?.id_propietario?.nombre))).map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
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
              {Array.from(new Set(distribuciones.map(item => item.bus_propietario?.id_bus?.placa))).map(placa => (
                <option key={placa} value={placa}>{placa}</option>
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
              <p className="text-sm font-medium text-gray-600">Total Distribuciones</p>
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
              <p className="text-sm font-medium text-gray-600">Valor Total Distribuido</p>
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
              <p className="text-sm font-medium text-gray-600">Promedio por Distribución</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.promedioValor)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Porcentaje</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(estadisticas.promedioPorcentaje)}</p>
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
                      Propietario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Porcentaje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Aplicado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((distribucion) => (
                    <tr key={distribucion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {distribucion.id_planilla_bus?.id_planilla?.prefijo}-{distribucion.id_planilla_bus?.id_planilla?.num_planilla}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {distribucion.bus_propietario?.id_bus?.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {distribucion.bus_propietario?.id_propietario?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {formatPercentage(distribucion.porcentaje_aplicado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(distribucion.valor_aplicado || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(distribucion.creado_en)}
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

export default PlanillaDistribucion;
