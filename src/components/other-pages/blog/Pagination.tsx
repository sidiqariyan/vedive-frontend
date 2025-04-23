import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Always show first page
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`${
            currentPage === 1
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } px-4 py-2 mx-1 rounded-md transition-colors duration-200`}
        >
          1
        </button>
      );
      
      // Show ellipsis if not on first few pages
      if (currentPage > 3) {
        pageNumbers.push(
          <span key="ellipsis-1" className="px-3 py-2">
            ...
          </span>
        );
      }
      
      // Show current page and adjacent pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } px-4 py-2 mx-1 rounded-md transition-colors duration-200`}
          >
            {i}
          </button>
        );
      }
      
      // Show ellipsis if not on last few pages
      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <span key="ellipsis-2" className="px-3 py-2">
            ...
          </span>
        );
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`${
              currentPage === totalPages
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } px-4 py-2 mx-1 rounded-md transition-colors duration-200`}
          >
            {totalPages}
          </button>
        );
      }
    } else {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } px-4 py-2 mx-1 rounded-md transition-colors duration-200`}
          >
            {i}
          </button>
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 mx-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        } transition-colors duration-200`}
      >
        Previous
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 mx-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        } transition-colors duration-200`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;