import api from './api';

export const movieService = {
  getMovies: async (params) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  searchMovies: async (searchTerm, page = 1, limit = 10) => {
    const response = await api.get('/movies', {
      params: {
        search: searchTerm,
        page,
        limit
      }
    });
    return response.data;
  }
};