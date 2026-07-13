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

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>

        <TableHead>

          <TableRow>

            <TableCell>Cédula</TableCell>

            <TableCell>Nombre</TableCell>

            <TableCell>Correo</TableCell>

            <TableCell>Rol</TableCell>

            <TableCell>Estado</TableCell>

            <TableCell align="center">
              Acciones
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {users.map((user) => (

            <TableRow key={user.id_user}>

              <TableCell>
                {user.identification}
              </TableCell>

              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>

              <TableCell>
                {user.email}
              </TableCell>

              <TableCell>
                {user.role_name}
              </TableCell>

              <TableCell>

                <Chip
                  label={user.status}
                  color={
                    user.status === "Active"
                      ? "success"
                      : "error"
                  }
                />

              </TableCell>

              <TableCell align="center">

                <IconButton
                  color="primary"
                  onClick={() => onEdit(user)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => onDelete(user)}
                >
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