import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async (page = 1, limit = 15, search = '') => {
    const response = await api.get('/admin/users', { params: { page, limit, search } });
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  getMovies: async (page = 1, limit = 15, search = '', genre = '') => {
    const response = await api.get('/admin/movies', { params: { page, limit, search, genre } });
    return response.data;
  },
  createMovie: async (movieData) => {
    const response = await api.post('/admin/movies', movieData);
    return response.data;
  },
  deleteMovie: async (id) => {
    const response = await api.delete(`/admin/movies/${id}`);
    return response.data;
  }
};
