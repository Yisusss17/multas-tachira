// src/admin/pages/infractions/ReviewInfractions.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../../../api/axios';

const ReviewInfractions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [infractions, setInfractions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchPendingInfractions();
  }, []);

  const fetchPendingInfractions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/multas/pendientes');
      if (response.data.status === 200) {
        setInfractions(response.data.message);
      }
    } catch (error) {
      console.error('Error cargando multas pendientes:', error);
      setError('Error al cargar las multas pendientes de revisión');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (infraction, actionType) => {
    setSelectedInfraction(infraction);
    setAction(actionType);
    setReviewComment('');
    setOpenDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedInfraction) return;

    try {
      const payload = {
        status: action === 'approve' ? 'Pagada' : 'Anulada',
        comments: reviewComment || `Multa ${action === 'approve' ? 'aprobada' : 'rechazada'} por el supervisor`,
        reviewed_by: user.id,
      };

      const response = await api.put(`/multas/${selectedInfraction.multaca_prk}/revisar`, payload);
      
      if (response.data.status === 200) {
        setSuccess(`Multa ${selectedInfraction.multaca_nro} ${action === 'approve' ? 'aprobada' : 'rechazada'} correctamente`);
        setOpenDialog(false);
        fetchPendingInfractions();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error revisando multa:', error);
      setError('Error al procesar la revisión');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Procesando': 'warning',
      'Pagada': 'success',
      'Pendiente': 'info',
      'Anulada': 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Revisión de Multas
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchPendingInfractions}
          disabled={loading}
          sx={{ bgcolor: '#1976d2' }}
        >
          Actualizar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Cargando multas pendientes...
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell><strong>N° Boleta</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Oficial</strong></TableCell>
                <TableCell><strong>Lugar</strong></TableCell>
                <TableCell><strong>Monto</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {infractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay multas pendientes de revisión
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                infractions.map((item) => (
                  <TableRow key={item.multaca_prk} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {item.multaca_nro}
                    </TableCell>
                    <TableCell>
                      {new Date(item.multaca_fec).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{item.oficial_nombre || 'N/A'}</TableCell>
                    <TableCell>{item.multaca_lug}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      Bs {parseFloat(item.multaca_mon).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.multaca_est}
                        color={getStatusColor(item.multaca_est)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleReview(item, 'approve')}
                          title="Aprobar multa"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleReview(item, 'reject')}
                          title="Rechazar multa"
                        >
                          <CancelIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Diálogo de revisión */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'approve' ? 'Aprobar' : 'Rechazar'} Multa
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Boleta:</strong> {selectedInfraction?.multaca_nro}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Monto:</strong> Bs {selectedInfraction?.multaca_mon}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comentarios (opcional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Agregue observaciones sobre la revisión..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
          >
            {action === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewInfractions;