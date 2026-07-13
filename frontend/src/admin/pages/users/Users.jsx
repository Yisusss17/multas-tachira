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
import { getUsers, deleteUser } from "src/admin/api/users";
import UsersTable from "./components/UsersTable";
import DeleteDialog from "./components/DeleteDialog";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Delete Dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data.message || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.id_user}`);
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const handleConfirmDelete = async () => {
    const { user } = deleteDialog;
    try {
      await deleteUser(user.id_user);
      showSnackbar("Usuario eliminado correctamente", "success");
      loadUsers(); // reload list
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al eliminar usuario", "error");
    } finally {
      setDeleteDialog({ open: false, user: null });
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
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/users/register")}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Reusable Delete Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        content={`¿Estás seguro de que deseas eliminar al usuario ${deleteDialog.user?.first_name} ${deleteDialog.user?.last_name}? Esta acción no se puede deshacer.`}
      />

      {/* Reusable Snackbar */}
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