import React from 'react';

const TableWrapper = ({ children, className = "" }) => {
  return (
    <div className={`table-scroll-container ${className}`}>
      {children}
    </div>
  );
};

export default TableWrapper;
