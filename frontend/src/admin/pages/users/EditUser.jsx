import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { CONFIG } from "src/admin/config-global";
import UserForm from './components/UserForm';
import { getUser, updateUser } from 'src/admin/api/users';
import {
  getOfficerByUser,
  updateOfficer,
  createOfficer
} from 'src/admin/api/officers';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditUser() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {

    try {

      const response = await getUser(id);
      const userData = response.data.message;

      let officerData = null;

      try {

        const officerRes = await getOfficerByUser(id);
        officerData = officerRes.data.message;

      } catch (err) {
        // Si no existe oficial simplemente continuar
      }

      setInitialData({
        ...userData,
        badge_code: officerData?.badge_code || '',
        id_officer: officerData?.id_officer || null
      });

    } catch (error) {

      console.error(error);
      showSnackbar("Error al cargar los datos del usuario", "error");

    } finally {

      setLoading(false);

    }

  };

  const handleSubmit = async (formData) => {

    try {

      // ==========================
      // NO enviar badge_code a /users
      // ==========================
      const { badge_code, ...userData } = formData;

      await updateUser(id, userData);

      // ==========================
      // Crear/Actualizar Officer
      // ==========================
      if (badge_code) {

        if (initialData.id_officer) {

          await updateOfficer(initialData.id_officer, {
            id_user: id,
            badge_code,
            status: formData.status
          });

        } else {

          await createOfficer({
            id_user: id,
            badge_code,
            status: formData.status
          });

        }

      }

      showSnackbar(
        "Usuario actualizado correctamente",
        "success"
      );

      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);

    } catch (error) {

      console.error(error);

      let errorMessage = "Error al actualizar usuario";

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

    setSnackbar({
      open: true,
      message,
      severity
    });

  };

  const handleCloseSnackbar = () => {

    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));

  };

  if (loading) {

    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  }

  return (

    <Box>

      <title>{`Editar Usuario - ${CONFIG.appName}`}</title>

      {initialData && (
        <UserForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>

  );

}