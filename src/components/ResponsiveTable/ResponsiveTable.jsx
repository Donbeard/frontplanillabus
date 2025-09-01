import React from 'react';

const ResponsiveTable = ({ 
  data, 
  columns, 
  emptyMessage = "No hay datos disponibles",
  onEdit,
  onDelete,
  getRowKey = (item) => item.id,
  getRowTitle = (item) => item.nombre || item.placa || item.numero || 'Item'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Vista móvil - Tarjetas */}
      <div className="mobile-table-container">
        {data.map((item) => (
          <div key={getRowKey(item)} className="mobile-table-card">
            <div className="mobile-table-header">
              <h3 className="mobile-table-title">{getRowTitle(item)}</h3>
            </div>
            <div className="mobile-table-content">
              {columns.map((column) => (
                <div key={column.key} className="mobile-table-row">
                  <span className="mobile-table-label">{column.label}</span>
                  <span className="mobile-table-value">
                    {column.render ? column.render(item) : item[column.key]}
                  </span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="mobile-table-actions">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)}
                      className="mobile-table-action-btn mobile-table-action-btn-edit"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(item)}
                      className="mobile-table-action-btn mobile-table-action-btn-delete"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vista desktop - Tabla normal */}
      <div className="desktop-table-container">
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="table">
            <thead className="table-header">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="table-header-cell">
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="table-header-cell">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="table-body">
              {data.map((item) => (
                <tr key={getRowKey(item)} className="table-row">
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button 
                            onClick={() => onEdit(item)}
                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                          >
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveTable;
