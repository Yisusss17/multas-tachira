import api from 'src/api/axios'; // Importamos nuestra conexión inteligente

export const getOfficers = () =>
    api.get('/officers');

export const getOfficer = (id) =>
    api.get(`/officers/${id}`);

export const getOfficerByUser = (userId) =>
    api.get(`/officers/user/${userId}`);

export const createOfficer = (data) =>
    api.post('/officers', data);

export const updateOfficer = (id, data) =>
    api.put(`/officers/${id}`, data);

export const deleteOfficer = (id) =>
    api.delete(`/officers/${id}`);

// Para cargar los usuarios en el dropdown al crear un oficial
export const getUsers = () =>
    api.get('/users');