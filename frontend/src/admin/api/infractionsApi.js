// frontend/src/admin/api/infractionsApi.js
import api from '../../api/axios';

export const infractionsApi = {
  // ============================================
  // BÚSQUEDA DE DATOS
  // ============================================
  
  getPersonaByCedula: async (cedula) => {
    const response = await api.get(`/personas/cedula/${cedula}`);
    return response.data;
  },

  getInfractores: async () => {
    const response = await api.get('/infractores');
    return response.data;
  },

  getVehiculosByPersona: async (personaId) => {
    const response = await api.get(`/vehiculos/persona/${personaId}`);
    return response.data;
  },

  // ============================================
  // CATÁLOGOS (SOLO INFRACCIONES)
  // ============================================
  
  getInfracciones: async () => {
    const response = await api.get('/infractions');
    return response.data;
  },

  // ============================================
  // GENERACIÓN DE BOLETA
  // ============================================
  
  getUltimoNumeroBoleta: async () => {
    const response = await api.get('/multas/ultimo');
    return response.data;
  },

  // ============================================
  // CREACIÓN DE MULTA
  // ============================================
  
  createMulta: async (data) => {
    const response = await api.post('/multas', data);
    return response.data;
  },

  createDetalleMulta: async (data) => {
    const response = await api.post('/multas/detalle', data);
    return response.data;
  },

  // ============================================
  // FUNCIONARIO ACTUAL
  // ============================================
  
  getFuncionarioByUser: async (userId) => {
    const response = await api.get(`/funcionarios/usuario/${userId}`);
    return response.data;
  }
};