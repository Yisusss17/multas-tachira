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
import { getInfractions, deleteInfraction } from "src/admin/api/infractions";
import InfractionsTable from "./components/InfractionsTable";
import DeleteDialog from "src/admin/pages/users/components/DeleteDialog";

export default function InfractionsCatalog() {
  const navigate = useNavigate();
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, infraction: null });

  useEffect(() => {
    loadInfractions();
  }, []);

  const loadInfractions = async () => {
    setLoading(true);
    try {
      const response = await getInfractions();
      setInfractions(response.data.message || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar infracciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (infraction) => {
    navigate(`/admin/infractions-catalog/edit/${infraction.infraction_id}`);
  };

  const handleDeleteClick = (infraction) => {
    setDeleteDialog({ open: true, infraction });
  };

  const handleConfirmDelete = async () => {
    const { infraction } = deleteDialog;
    try {
      await deleteInfraction(infraction.infraction_id);
      showSnackbar("Infracción eliminada correctamente", "success");
      loadInfractions();
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al eliminar infracción", "error");
    } finally {
      setDeleteDialog({ open: false, infraction: null });
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
        <Typography variant="h4">Catálogo de Infracciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/infractions-catalog/register")}
        >
          Nueva Infracción
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <InfractionsTable
          infractions={infractions}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, infraction: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Infracción"
        content={`¿Estás seguro de que deseas eliminar la infracción ID ${deleteDialog.infraction?.infraction_id}? Esta acción no se puede deshacer.`}
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
