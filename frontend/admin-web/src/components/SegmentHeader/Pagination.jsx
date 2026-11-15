import React, { useState, useEffect } from 'react';
import './Pagination.less';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const generatePageNumbers = () => {
      const pages = [];
      const maxPageNumbers = 5; // Max 5 pages visible
      const halfMax = Math.floor(maxPageNumbers / 2);

      let startPage = Math.max(currentPage - halfMax, 1);
      let endPage = Math.min(currentPage + halfMax, totalPages);

      // Adjust if we're near the beginning
      if (startPage === 1) {
        endPage = Math.min(maxPageNumbers, totalPages);
      }

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(totalPages - maxPageNumbers + 1, 1);
      }

      // Push the first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // Push the visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Push the last page and ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    setPageNumbers(generatePageNumbers());
  }, [currentPage, totalPages]); // Recalculate when currentPage or totalPages change

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.85365 1.40459L7.85316 1.40401C7.75234 1.28427 7.64609 1.25046 7.56739 1.25C7.48877 1.24955 7.39022 1.28178 7.29936 1.38968L1.76133 7.96692L1.76084 7.9675C1.71136 8.02614 1.66671 8.10242 1.63454 8.19454L0.947535 7.95459L1.63453 8.19454C1.60237 8.28663 1.58477 8.38873 1.58477 8.49408C1.58477 8.59944 1.60237 8.70154 1.63453 8.79363C1.66671 8.88575 1.71136 8.96202 1.76084 9.02067L1.76133 9.02125L7.29936 15.5985C7.39823 15.7159 7.50184 15.75 7.57626 15.75C7.65069 15.75 7.7543 15.7159 7.85316 15.5985C7.95527 15.4772 8.02921 15.289 8.02921 15.0713C8.02921 14.8536 7.95527 14.6654 7.85316 14.5442L3.17178 8.98431L2.76503 8.50125L3.17178 8.01818L7.85316 2.45834L7.85365 2.45776C7.90313 2.39912 7.94778 2.32284 7.97996 2.23072C8.01212 2.13863 8.02972 2.03653 8.02972 1.93118C8.02972 1.82582 8.01212 1.72372 7.97996 1.63163C7.94778 1.53951 7.90313 1.46323 7.85365 1.40459Z" fill="#1E1E1E" stroke="#1E1E1E" strokeWidth="1.5"/>
        </svg>
      </button>

      {pageNumbers.map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.572909 0.920947C0.461058 1.05351 0.37232 1.21098 0.311774 1.38433C0.251228 1.55768 0.220062 1.7435 0.220062 1.93118C0.220062 2.11885 0.251228 2.30468 0.311774 2.47802C0.37232 2.65137 0.461058 2.80884 0.572909 2.94141L5.2543 8.50125L0.572909 14.0611C0.347312 14.329 0.220573 14.6924 0.220573 15.0713C0.220573 15.4502 0.347312 15.8136 0.572909 16.0816C0.798506 16.3495 1.10448 16.5 1.42352 16.5C1.74256 16.5 2.04854 16.3495 2.27414 16.0816L7.81217 9.50431C7.92402 9.37175 8.01276 9.21428 8.07331 9.04093C8.13385 8.86758 8.16502 8.68176 8.16502 8.49408C8.16502 8.30641 8.13385 8.12058 8.07331 7.94724C8.01276 7.77389 7.92402 7.61642 7.81217 7.48385L2.27414 0.906617C1.81565 0.362096 1.04346 0.362096 0.572909 0.920947Z" fill="#1E1E1E"/>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
