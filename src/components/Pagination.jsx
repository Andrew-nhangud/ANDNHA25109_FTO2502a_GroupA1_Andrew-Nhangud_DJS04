import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ podcastsPerPage, totalPodcasts, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPodcasts / podcastsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className="page-item">
          <button 
            onClick={() => paginate(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1}
            className="page-link"
            aria-label="Previous page"
          >
            &laquo;
          </button>
        </li>
        
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button 
              onClick={() => paginate(number)} 
              className="page-link"
              aria-label={`Go to page ${number}`}
            >
              {number}
            </button>
          </li>
        ))}
        
        <li className="page-item">
          <button 
            onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))} 
            disabled={currentPage === pageNumbers.length}
            className="page-link"
            aria-label="Next page"
          >
            &raquo;
          </button>
        </li>
      </ul>
      <div className="pagination-info">
        Showing {((currentPage - 1) * podcastsPerPage) + 1}-{Math.min(currentPage * podcastsPerPage, totalPodcasts)} of {totalPodcasts} podcasts
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  podcastsPerPage: PropTypes.number.isRequired,
  totalPodcasts: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired
};

export default Pagination;
