import React, { useState } from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'modalAppear 0.3s ease-out'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '24px'
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    fontSize: '14px'
  },
  confirmButton: {
    padding: '8px 16px',
    backgroundColor: '#0066cc',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '14px'
  }
};

// Ajouter l'animation au style global
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

const ReservationModal = ({ movie, onClose, onConfirm }) => {
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedDateTime);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>Réserver {movie.title}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date et heure</label>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={styles.confirmButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0052a3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0066cc';
              }}
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;