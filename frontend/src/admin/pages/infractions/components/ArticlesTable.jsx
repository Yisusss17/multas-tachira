// frontend/src/admin/pages/infractions/components/ArticlesTable.jsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ArticlesTable = ({ articulos, montoTotal, onEliminar }) => {
  return (
    <Paper sx={{ mt: 3 }}>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Categoría</strong></TableCell>
              <TableCell><strong>Artículo</strong></TableCell>
              <TableCell><strong>Numeral</strong></TableCell>
              <TableCell align="right"><strong>Monto (Bs)</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articulos.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Chip
                    label={item.categoria}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{item.articulo}</TableCell>
                <TableCell>
                  <Chip
                    label={`Num. ${item.numeral}`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Bs {item.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onEliminar(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Fila de total */}
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell colSpan={3} />
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>TOTAL</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Bs {montoTotal.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ArticlesTable;