import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { tiquetesAPI, coreAPI, usuariosAPI, planillasAPI, perfilesRutasAPI } from '../../services/api';
import Notification from '../../components/Notification/Notification';
import useNotification from '../../hooks/useNotification';
import TiqueteForm from './TiqueteForm';

const Tiquetes = () => {
  const [tiquetes, setTiquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTiquete, setEditingTiquete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    planilla: '',
    vendedor: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [planillas, setPlanillas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Cargar tiquetes al montar el componente
  useEffect(() => {
    loadTiquetes();
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [planillasRes, vendedoresRes] = await Promise.all([
        planillasAPI.getAll(),
        usuariosAPI.getAll()
      ]);

      setPlanillas(planillasRes.data.results || planillasRes.data);
      setVendedores(vendedoresRes.data.results || vendedoresRes.data);
    } catch (error) {
      console.error('Error cargando datos de referencia:', error);
    }
  };

  const loadTiquetes = async () => {
    try {
      setLoading(true);
      const response = await tiquetesAPI.getAll();
      setTiquetes(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando tiquetes:', err);
      setError('Error al cargar los tiquetes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (tiquete) => {
    try {
      // Obtener la información completa del tiquete
      const response = await tiquetesAPI.getById(tiquete.id);
      setEditingTiquete(response.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error obteniendo información del tiquete:', err);
      showError('Error al cargar la información del tiquete');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tiquete?')) {
      try {
        await tiquetesAPI.delete(id);
        await loadTiquetes(); // Recargar la lista
        showSuccess('Tiquete eliminado correctamente');
      } catch (err) {
        console.error('Error eliminando tiquete:', err);
        showError('Error al eliminar el tiquete');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTiquete(null);
  };

  const handleFormSubmit = async (tiqueteData) => {
    try {
      if (editingTiquete) {
        // Actualizar tiquete existente
        await tiquetesAPI.update(editingTiquete.id, tiqueteData);
        showSuccess('Tiquete actualizado correctamente');
      } else {
        // Crear nuevo tiquete
        await tiquetesAPI.create(tiqueteData);
        showSuccess('Tiquete creado correctamente');
      }
      await loadTiquetes(); // Recargar la lista
      handleFormClose();
    } catch (err) {
      console.error('Error guardando tiquete:', err);
      showError('Error al guardar el tiquete');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Resetear a la primera página cuando cambien los filtros
  };

  const filteredTiquetes = tiquetes.filter(tiquete => {
    const matchesSearch = !filters.search || 
      tiquete.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
      tiquete.numero_documento?.includes(filters.search) ||
      tiquete.correo?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesPlanilla = !filters.planilla || 
      tiquete.id_planilla?.toString() === filters.planilla;
    
    const matchesVendedor = !filters.vendedor || 
      tiquete.id_vendedor?.toString() === filters.vendedor;

    // Filtro por fecha
    let matchesDate = true;
    if (filters.fechaInicio || filters.fechaFin) {
      const tiqueteDate = new Date(tiquete.creado_en).toISOString().split('T')[0];
      
      if (filters.fechaInicio && tiqueteDate < filters.fechaInicio) {
        matchesDate = false;
      }
      if (filters.fechaFin && tiqueteDate > filters.fechaFin) {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesPlanilla && matchesVendedor && matchesDate;
  });

  // Calcular estadísticas
  const totalTiquetes = filteredTiquetes.length;
  const totalPasajeros = filteredTiquetes.reduce((total, tiquete) => total + (tiquete.num_asientos || 0), 0);
  const totalRecaudado = filteredTiquetes.reduce((total, tiquete) => total + (parseFloat(tiquete.total) || 0), 0);
  const promedioPorTiquete = totalTiquetes > 0 ? totalRecaudado / totalTiquetes : 0;

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTiquetes = filteredTiquetes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTiquetes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tiquetes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de tiquetes y ventas
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando tiquetes...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Tiquetes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de tiquetes y ventas
            </p>
          </div>
        </div>
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadTiquetes}
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
          <h1 className="text-2xl font-bold text-gray-900">Tiquetes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de tiquetes y ventas
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Tiquete
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Nombre, documento, correo..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planilla
            </label>
            <select 
              className="input-field"
              value={filters.planilla}
              onChange={(e) => handleFilterChange('planilla', e.target.value)}
            >
              <option value="">Todas las planillas</option>
              {Array.isArray(planillas) && planillas.map((planilla) => (
                <option key={planilla.id} value={planilla.id}>
                  {planilla.prefijo}-{planilla.num_planilla}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendedor
            </label>
            <select 
              className="input-field"
              value={filters.vendedor}
              onChange={(e) => handleFilterChange('vendedor', e.target.value)}
            >
              <option value="">Todos los vendedores</option>
              {Array.isArray(vendedores) && vendedores.map((vendedor) => (
                <option key={vendedor.id} value={vendedor.id}>
                  {vendedor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.fechaInicio}
              onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.fechaFin}
              onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="table w-full">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nombre</th>
                <th className="table-header-cell">Correo</th>
                <th className="table-header-cell">Tipo Doc.</th>
                <th className="table-header-cell">Número Doc.</th>
                <th className="table-header-cell">Asientos</th>
                <th className="table-header-cell">Valor Unit.</th>
                <th className="table-header-cell">Total</th>
                <th className="table-header-cell">Planilla</th>
                <th className="table-header-cell">Vendedor</th>
                <th className="table-header-cell">Fecha</th>
                <th className="table-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
                                            {currentTiquetes.length === 0 ? (
                 <tr>
                   <td colSpan="11" className="table-cell text-center text-gray-500 py-8">
                     No hay tiquetes registrados
                   </td>
                 </tr>
               ) : (
                                   currentTiquetes.map((tiquete) => (
                    <tr key={tiquete.id} className="table-row">
                      <td className="table-cell">
                        <p className="font-medium">{tiquete.nombre}</p>
                      </td>
                      <td className="table-cell">
                        <p className="text-sm text-gray-600">{tiquete.correo}</p>
                      </td>
                      <td className="table-cell">
                        <p className="text-sm text-gray-600">{tiquete.tipo_documento}</p>
                      </td>
                      <td className="table-cell">
                        <p className="font-medium">{tiquete.numero_documento}</p>
                      </td>
                      <td className="table-cell text-center">{tiquete.num_asientos}</td>
                      <td className="table-cell text-right">${parseFloat(tiquete.valor_unitario || 0).toLocaleString()}</td>
                      <td className="table-cell text-right">${parseFloat(tiquete.total || 0).toLocaleString()}</td>
                      <td className="table-cell">
                        {tiquete.planilla_prefijo && tiquete.planilla_numero ? 
                          `${tiquete.planilla_prefijo}-${tiquete.planilla_numero}` : 'N/A'}
                      </td>
                      <td className="table-cell">
                        <p>{tiquete.vendedor_nombre || 'N/A'}</p>
                      </td>
                      <td className="table-cell">
                        {new Date(tiquete.creado_en).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(tiquete)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tiquete.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Eliminar"
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

      {/* Controles de paginación */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredTiquetes.length)}</span> de <span className="font-medium">{filteredTiquetes.length}</span> tiquetes
            </div>
                         <div className="flex items-center space-x-2">
               <label className="text-sm text-gray-700">Mostrar:</label>
               <select
                 value={itemsPerPage}
                 onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                 className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white appearance-none cursor-pointer pr-8"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                   backgroundPosition: 'right 0.5rem center',
                   backgroundRepeat: 'no-repeat',
                   backgroundSize: '1.5em 1.5em'
                 }}
               >
                 <option value={10}>10</option>
                 <option value={20}>20</option>
                 <option value={50}>50</option>
                 <option value={100}>100</option>
               </select>
               <span className="text-sm text-gray-700">por página</span>
             </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Primera página"
              >
                «
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
              >
                ‹
              </button>
              
                             {(() => {
                 const pages = [];
                 const maxVisiblePages = 5;
                 
                 // Si hay pocas páginas, mostrar todas
                 if (totalPages <= maxVisiblePages) {
                   for (let i = 1; i <= totalPages; i++) {
                     pages.push(
                       <button
                         key={i}
                         onClick={() => handlePageChange(i)}
                         className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-300 transition-colors ${
                           currentPage === i
                             ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
                             : 'text-gray-500 bg-white hover:bg-gray-50'
                         }`}
                       >
                         {i}
                       </button>
                     );
                   }
                 } else {
                   // Lógica para muchas páginas
                   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                   let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                   
                   if (endPage - startPage + 1 < maxVisiblePages) {
                     startPage = Math.max(1, endPage - maxVisiblePages + 1);
                   }
                   
                   // Agregar "..." al inicio si es necesario
                   if (startPage > 1) {
                     pages.push(
                       <button
                         key="start-ellipsis"
                         className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 cursor-default"
                       >
                         ...
                       </button>
                     );
                   }
                   
                   // Agregar números de página
                   for (let i = startPage; i <= endPage; i++) {
                     pages.push(
                       <button
                         key={i}
                         onClick={() => handlePageChange(i)}
                         className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-300 transition-colors ${
                           currentPage === i
                             ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
                             : 'text-gray-500 bg-white hover:bg-gray-50'
                         }`}
                       >
                         {i}
                       </button>
                     );
                   }
                   
                   // Agregar "..." al final si es necesario
                   if (endPage < totalPages) {
                     pages.push(
                       <button
                         key="end-ellipsis"
                         className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 cursor-default"
                       >
                         ...
                       </button>
                     );
                   }
                 }
                 
                 return pages;
               })()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
              >
                ›
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Última página"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{totalTiquetes}</p>
            <p className="text-sm text-gray-600">Total Tiquetes</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{totalPasajeros}</p>
            <p className="text-sm text-gray-600">Total Pasajeros</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ${totalRecaudado.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Recaudado</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${promedioPorTiquete.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Promedio por Tiquete</p>
          </div>
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <TiqueteForm
          tiquete={editingTiquete}
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

export default Tiquetes;
