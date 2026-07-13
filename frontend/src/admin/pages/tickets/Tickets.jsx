import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTickets, deleteTicket } from "src/admin/api/tickets";
import TicketsTable from "./components/TicketsTable";
import DeleteDialog from "src/admin/pages/users/components/DeleteDialog";

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticket: null });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets();
      setTickets(response.data.message || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar multas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (ticket) => {
    navigate(`/admin/infractions/${ticket.id_ticket}`); // Use the existing infraction details page
  };

  const handleDeleteClick = (ticket) => {
    setDeleteDialog({ open: true, ticket });
  };

  const handleConfirmDelete = async () => {
    const { ticket } = deleteDialog;
    try {
      await deleteTicket(ticket.id_ticket);
      showSnackbar("Multa eliminada correctamente", "success");
      loadTickets();
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Error al eliminar multa", "error");
    } finally {
      setDeleteDialog({ open: false, ticket: null });
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
        <Typography variant="h4">Gestión de Multas</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TicketsTable
          tickets={tickets}
          onView={handleView}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, ticket: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Multa"
        content={`¿Estás seguro de que deseas eliminar la boleta ${deleteDialog.ticket?.ticket_number}? Esta acción no se puede deshacer.`}
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
