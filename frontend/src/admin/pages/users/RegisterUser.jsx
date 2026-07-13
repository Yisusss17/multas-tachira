import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import UserForm from './components/UserForm';
import { createUser } from 'src/admin/api/users';
import { createOfficer } from 'src/admin/api/officers';
import { useNavigate } from 'react-router-dom';

export default function RegisterUser() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (formData) => {

  try {

    // Extraemos badge_code para NO enviarlo al endpoint /users
    const { badge_code, ...userData } = formData;

    // Crear usuario
    const userResponse = await createUser(userData);

    const newUser = userResponse.data.message;

    // Crear officer únicamente si existe badge_code
    if (badge_code && badge_code.trim() !== "") {

      await createOfficer({
        id_user: newUser.id_user,
        badge_code,
        status: userData.status
      });

    }

    showSnackbar(
      "Usuario creado correctamente",
      "success"
    );

    setTimeout(() => {

      navigate("/admin/users");

    }, 1500);

  } catch (error) {

    console.error(error);

    let errorMessage = "Error al crear usuario";

    if (error.response?.data?.message) {

      if (Array.isArray(error.response.data.message)) {

        errorMessage =
          error.response.data.message[0].message;

      } else {

        errorMessage =
          error.response.data.message;

      }

    }

    showSnackbar(errorMessage, "error");

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
      <title>{`Registrar Usuario - ${CONFIG.appName}`}</title>
      
      <UserForm onSubmit={handleSubmit} isEdit={false} />

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