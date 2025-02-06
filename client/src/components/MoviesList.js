import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, Calendar } from 'lucide-react';
import ReservationModal from './ReservationModal';
import api from '../services/api';

const styles = {
  errorAlert: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '4px',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
  },
  moviesContainer: {
    padding: '32px',
    background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
    minHeight: '100vh'
  },
  moviesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  movieCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #333',
    transition: 'transform 0.3s ease'
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: '2/3',
    overflow: 'hidden'
  },
  moviePoster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  movieInfo: {
    padding: '20px'
  },
  movieTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px'
  },
  movieOverview: {
    color: '#999',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '15px',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px'
  },
  starIcon: {
    color: '#ffd700',
    width: '20px',
    height: '20px'
  },
  ratingText: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  reserveButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#0066cc',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }
};

const MoviesList = ({ movies }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const handleReservationClick = (movie) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError(null);
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleReservationConfirm = async (dateTime) => {
    try {
      await api.post('/reservations', {
        movieId: selectedMovie.id,
        dateReservation: dateTime,
      });
      setError(null);
      setShowModal(false);
    } catch (error) {
      if (error.response?.status === 409) {
        setError(error.response.data.message);
      } else {
        setError('Une erreur est survenue lors de la réservation');
      }
    }
  };

  return (
    <>
      {error && (
        <div style={styles.errorAlert}>
          {error}
        </div>
      )}

      <div style={styles.moviesContainer}>
        <div style={styles.moviesGrid}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              style={styles.movieCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.posterContainer}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/api/placeholder/300/450'
                  }
                  alt={movie.title}
                  style={styles.moviePoster}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>

              <div style={styles.movieInfo}>
                <h3 style={styles.movieTitle}>{movie.title}</h3>
                <p style={styles.movieOverview}>{movie.overview}</p>

                <div style={styles.rating}>
                  <Star style={styles.starIcon} />
                  <span style={styles.ratingText}>
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>

                <button
                  onClick={() => handleReservationClick(movie)}
                  style={styles.reserveButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#0052a3';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#0066cc';
                  }}
                >
                  <Calendar style={{ width: '20px', height: '20px' }} />
                  <span>Réserver</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal &&
        selectedMovie &&
        createPortal(
          <ReservationModal
            movie={selectedMovie}
            onClose={() => {
              setShowModal(false);
              setError(null);
            }}
            onConfirm={handleReservationConfirm}
          />,
          document.body
        )}
    </>
  );
};

export default MoviesList;