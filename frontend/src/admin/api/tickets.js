import api from 'src/api/axios'; // Importamos nuestra conexión inteligente

export const getTickets = () =>
  api.get('/tickets');

export const getTicket = (id) =>
  api.get(`/tickets/${id}`);

export const createTicket = (data) =>
  api.post('/tickets', data);

export const updateTicket = (id, data) =>
  api.put(`/tickets/${id}`, data);

export const updateTicketStatus = (id, status) =>
  api.patch(`/tickets/${id}/status`, { status });

export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`);