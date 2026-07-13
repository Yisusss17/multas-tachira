import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import InfractionForm from './components/InfractionForm';
import { getInfraction, updateInfraction } from 'src/admin/api/infractions';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditInfraction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInfraction();
  }, [id]);

  const loadInfraction = async () => {
    try {
      const response = await getInfraction(id);
      setInitialData(response.data.message);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar datos de la infracción", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateInfraction(id, formData);
      showSnackbar("Infracción actualizada correctamente", "success");
      setTimeout(() => {
        navigate('/admin/infractions-catalog');
      }, 1500);
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al actualizar infracción", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <title>{`Editar Infracción - ${CONFIG.appName}`}</title>
      
      {initialData && (
        <InfractionForm initialData={initialData} onSubmit={handleSubmit} isEdit={true} />
      )}

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
