import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import OfficerForm from './components/OfficerForm';
import { createOfficer } from 'src/admin/api/officers';
import { useNavigate } from 'react-router-dom';

export default function RegisterOfficer() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (formData) => {
    try {
      await createOfficer(formData);
      showSnackbar("Funcionario creado correctamente", "success");
      setTimeout(() => {
        navigate('/admin/officers');
      }, 1500);
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al crear funcionario", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <title>{`Registrar Funcionario - ${CONFIG.appName}`}</title>
      
      <OfficerForm onSubmit={handleSubmit} isEdit={false} />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
