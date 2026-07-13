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

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OfficersTable({
  officers,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Placa</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {officers.map((officer) => (
            <TableRow key={officer.id_officer}>
              <TableCell>{officer.badge_code}</TableCell>
              <TableCell>{officer.identification}</TableCell>
              <TableCell>{officer.first_name} {officer.last_name}</TableCell>
              <TableCell>{officer.email}</TableCell>
              <TableCell>
                <Chip
                  label={officer.status}
                  color={officer.status === "Active" ? "success" : "error"}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(officer)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(officer)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
