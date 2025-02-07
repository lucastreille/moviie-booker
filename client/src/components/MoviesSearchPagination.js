import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const styles = {
  container: {
    padding: '12px 32px',
    background: '#0a0a0a',
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  searchForm: {
    flex: '1',
    maxWidth: '800px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchBar: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    height: '40px',
    padding: '0 16px 0 40px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#666',
    width: '18px',
    height: '18px'
  },
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  pageButton: {
    height: '36px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  pageButtonDisabled: {
    backgroundColor: '#1a1a1a',
    color: '#666',
    cursor: 'not-allowed'
  },
  pageInfo: {
    color: '#999',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap'
  }
};

const MoviesSearchPagination = ({ 
  onSearch, 
  onPageChange,
  currentPage, 
  totalPages 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.searchForm}>
          <div style={styles.searchBar}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher un film..."
              style={styles.searchInput}
              autoComplete="off"
            />
          </div>
        </div>

        <div style={styles.paginationContainer}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              ...styles.pageButton,
              ...(currentPage <= 1 ? styles.pageButtonDisabled : {})
            }}
          >
            <ChevronLeft size={16} />
            Précédent
          </button>

          <span style={styles.pageInfo}>
            Page {currentPage} sur {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              ...styles.pageButton,
              ...(currentPage >= totalPages ? styles.pageButtonDisabled : {})
            }}
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesSearchPagination;