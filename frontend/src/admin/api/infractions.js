import api from 'src/api/axios'; // Importamos nuestra conexión inteligente

export const getInfractions = () =>
  api.get('/infractions');

export const getInfraction = (id) =>
  api.get(`/infractions/${id}`);

export const createInfraction = (data) =>
  api.post('/infractions', data);

export const updateInfraction = (id, data) =>
  api.put(`/infractions/${id}`, data);

export const deleteInfraction = (id) =>
  api.delete(`/infractions/${id}`);