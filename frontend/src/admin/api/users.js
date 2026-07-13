import api from 'src/api/axios'; // Importamos nuestra conexión inteligente

export const getUsers = () => 
  api.get('/users');

export const getUser = (id) => 
  api.get(`/users/${id}`);

export const createUser = (data) => 
  api.post('/users', data);

export const updateUser = (id, data) => 
  api.put(`/users/${id}`, data);

export const deleteUser = (id) => 
  api.delete(`/users/${id}`);

export const getRoles = () => 
  api.get('/roles');