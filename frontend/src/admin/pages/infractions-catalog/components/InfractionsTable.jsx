import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function InfractionsTable({
  infractions,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Cantidad UT</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infractions.map((infraction) => (
            <TableRow key={infraction.infraction_id}>
              <TableCell>{infraction.infraction_id}</TableCell>
              <TableCell>{infraction.violation_description}</TableCell>
              <TableCell>{infraction.ut_quantity}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(infraction)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(infraction)}>
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
