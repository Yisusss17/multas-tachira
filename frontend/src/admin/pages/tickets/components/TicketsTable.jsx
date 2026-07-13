import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TicketsTable({
  tickets,
  onView,
  onDelete,
}) {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Paid': 'success',
      'Cancelled': 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Pending': 'Pendiente',
      'Paid': 'Pagada',
      'Cancelled': 'Anulada',
    };
    return labels[status] || status;
  };

  const calcularMonto = (ticket) => {
    const totalUt = parseFloat(ticket.total_ut) || 0;
    const valorUt = parseFloat(ticket.ut_daily_value_bs) || 0;
    return (totalUt * valorUt).toFixed(2);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>N° Boleta</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Oficial</TableCell>
            <TableCell>Conductor</TableCell>
            <TableCell>Monto (Bs)</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id_ticket}>
              <TableCell>{ticket.ticket_number}</TableCell>
              <TableCell>{new Date(ticket.issue_timestamp).toLocaleDateString('es-ES')}</TableCell>
              <TableCell>{ticket.officer_name || ticket.officer_badge}</TableCell>
              <TableCell>{ticket.driver_name}</TableCell>
              <TableCell>Bs {calcularMonto(ticket)}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(ticket.status)}
                  color={getStatusColor(ticket.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onView(ticket)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(ticket)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {tickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">No hay multas registradas.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
