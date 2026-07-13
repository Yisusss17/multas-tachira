import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import InfractionForm from './components/InfractionForm';
import { createInfraction } from 'src/admin/api/infractions';
import { useNavigate } from 'react-router-dom';

export default function RegisterInfraction() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (formData) => {
    try {
      await createInfraction(formData);
      showSnackbar("Infracción creada correctamente", "success");
      setTimeout(() => {
        navigate('/admin/infractions-catalog');
      }, 1500);
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al crear infracción", "error");
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
      <title>{`Registrar Infracción - ${CONFIG.appName}`}</title>
      
      <InfractionForm onSubmit={handleSubmit} isEdit={false} />

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
