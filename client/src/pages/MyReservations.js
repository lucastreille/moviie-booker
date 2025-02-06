import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Calendar, Clock, Film, Home } from 'lucide-react';
import api from '../services/api';

const styles = {
  container: {
    padding: '32px',
    background: '#0a0a0a',
    minHeight: '100vh',
    color: 'white'
  },
  header: {
    maxWidth: '1400px',
    margin: '0 auto 32px',
    padding: '0 0 24px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  homeLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#2a2a2a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    border: '1px solid #333',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  emptyMessage: {
    color: '#666',
    fontSize: '1.1rem',
    textAlign: 'center',
    padding: '48px 0'
  },
  reservationsGrid: {
    display: 'grid',
    gap: '16px'
  },
  reservationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #333',
    transition: 'transform 0.2s ease',
  },
  movieTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#999'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
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

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/reservations');
        console.log('Réservations reçues:', response.data); // Pour déboguer
        setReservations(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
      }
      setLoading(false);
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Link 
            to="/" 
            style={styles.homeLink}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.borderColor = '#444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.borderColor = '#333';
            }}
          >
            <Home size={18} />
            Accueil
          </Link>
          <h1 style={styles.title}>Mes Réservations</h1>
        </div>
      </div>

      <div style={styles.content}>
        {reservations.length === 0 ? (
          <p style={styles.emptyMessage}>
            Vous n'avez pas encore de réservations.
          </p>
        ) : (
          <div style={styles.reservationsGrid}>
            {reservations.map((reservation) => (
              <div 
                key={reservation.id} 
                style={styles.reservationCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={styles.movieTitle}>
                  {reservation.Movie?.title || 'Film non disponible'}
                </h3>
                <div style={styles.infoContainer}>
                  <div style={styles.infoRow}>
                    <Calendar size={18} />
                    <span>Réservé le {formatDate(reservation.createdAt)}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <Clock size={18} />
                    <span>Séance le {formatDate(reservation.dateReservation)}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <Film size={18} />
                    <span>Salle {reservation.salle || 'Non définie'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  style={styles.cancelButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  <Trash2 size={18} />
                  Annuler la réservation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;