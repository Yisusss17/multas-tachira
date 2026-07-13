import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getOfficers, deleteOfficer } from "src/admin/api/officers";
import OfficersTable from "./components/OfficersTable";
import DeleteDialog from "src/admin/pages/users/components/DeleteDialog"; // Reuse DeleteDialog

export default function Officers() {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, officer: null });

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    setLoading(true);
    try {
      const response = await getOfficers();
      setOfficers(response.data.message || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar funcionarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (officer) => {
    navigate(`/admin/users/edit/${officer.id_user}`);
  };

  const handleDeleteClick = (officer) => {
    setDeleteDialog({ open: true, officer });
  };

  const handleConfirmDelete = async () => {
    const { officer } = deleteDialog;
    try {
      await deleteOfficer(officer.id_officer);
      showSnackbar("Funcionario eliminado correctamente", "success");
      loadOfficers();
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al eliminar funcionario", "error");
    } finally {
      setDeleteDialog({ open: false, officer: null });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Gestión de Funcionarios</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <OfficersTable
          officers={officers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, officer: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Funcionario"
        content={`¿Estás seguro de que deseas eliminar al funcionario con placa ${deleteDialog.officer?.badge_code}? Esta acción no se puede deshacer.`}
      />

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
