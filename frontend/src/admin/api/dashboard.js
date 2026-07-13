import api from 'src/api/axios'; // Importamos nuestra conexión inteligente

export const getDashboardStats = () => 
  api.get('/dashboard/stats');

export const getTicketsByMonth = () => 
  api.get('/dashboard/tickets-by-month');

export const getTicketsByStatus = () => 
  api.get('/dashboard/tickets-by-status');

export const getTicketsByOfficer = () => 
  api.get('/dashboard/tickets-by-officer');

export const getTicketsByInfraction = () => 
  api.get('/dashboard/tickets-by-infraction');

export const getRecentTickets = () => 
  api.get('/dashboard/recent-tickets');