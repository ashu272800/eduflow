import api from './api';

export const notificationService = {
  getAll: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  getByRecipient: async (recipientId) => {
    const response = await api.get(`/api/notifications/recipient/${recipientId}`);
    return response.data;
  },

  send: async (recipientId, message, type = 'EMAIL') => {
    const response = await api.post('/api/notifications/send', {
      recipientId,
      message,
      type,
    });
    return response.data;
  },
};
