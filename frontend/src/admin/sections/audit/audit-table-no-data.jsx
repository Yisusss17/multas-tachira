import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function AuditTableNoData({ searchQuery, ...other }) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sin resultados
          </Typography>

          <Typography variant="body2">
            No se encontraron registros para &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> Verifique la búsqueda o use términos más amplios.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
