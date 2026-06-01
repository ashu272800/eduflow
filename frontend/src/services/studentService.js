import api from './api';

export const studentService = {
  getAll: async () => {
    const response = await api.get('/api/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },

  create: async (studentData) => {
    const response = await api.post('/api/students', studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await api.put(`/api/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },
};
