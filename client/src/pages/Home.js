import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import MoviesList from '../components/MoviesList';
import MoviesSearchPagination from '../components/MoviesSearchPagination';
import api from '../services/api';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: 'white'
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white'
  },
  reservationsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'white',
    fontSize: '0.95rem',
    textDecoration: 'none',
    borderRadius: '6px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    transition: 'all 0.2s ease'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #333',
    borderTop: '3px solid #0066cc',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    itemsPerPage: 5
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await api.get('/movies', {
          params: {
            page: searchParams.page,
            search: searchParams.search,
            limit: searchParams.itemsPerPage
          }
        });
        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [searchParams]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Films disponibles</h1>
          <Link 
            to="/mes-reservations" 
            style={styles.reservationsLink}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.borderColor = '#444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.borderColor = '#333';
            }}
          >
            <Ticket size={18} />
            Mes Réservations
          </Link>
        </div>
      </div>

      <MoviesSearchPagination
        onSearch={(search) => setSearchParams({...searchParams, search, page: 1})}
        onPageChange={(page) => setSearchParams({...searchParams, page})}
        onItemsPerPageChange={(itemsPerPage) => 
        setSearchParams({...searchParams, itemsPerPage, page: 1})}
        currentPage={searchParams.page}
        totalPages={totalPages}
      />

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      ) : (
        <MoviesList movies={movies} />
      )}
    </div>
  );
};

export default Home;