import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import OfficerForm from './components/OfficerForm';
import { getOfficer, updateOfficer } from 'src/admin/api/officers';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditOfficer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadOfficer();
  }, [id]);

  const loadOfficer = async () => {
    try {
      const response = await getOfficer(id);
      setInitialData(response.data.message);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar datos del funcionario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateOfficer(id, formData);
      showSnackbar("Funcionario actualizado correctamente", "success");
      setTimeout(() => {
        navigate('/admin/officers');
      }, 1500);
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al actualizar funcionario", "error");
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
      <title>{`Editar Funcionario - ${CONFIG.appName}`}</title>
      
      {initialData && (
        <OfficerForm initialData={initialData} onSubmit={handleSubmit} isEdit={true} />
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
