import api from './api';

export const courseService = {
  getAll: async () => {
    const response = await api.get('/api/courses');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },

  create: async (courseData) => {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  },

  update: async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },

  enroll: async (courseId, studentId) => {
    const response = await api.post(`/api/courses/${courseId}/enroll/${studentId}`);
    return response.data;
  },

  unenroll: async (courseId, studentId) => {
    const response = await api.delete(`/api/courses/${courseId}/unenroll/${studentId}`);
    return response.data;
  },
};
