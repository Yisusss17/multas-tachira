// src/admin/pages/infractions/MyInfractions.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../../../api/axios';

const MyInfractions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infractions, setInfractions] = useState([]);
  const [filteredInfractions, setFilteredInfractions] = useState([]);

  // Estado para los filtros
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchInfractions();
  }, []);

  // Efecto para filtrar localmente cuando cambian los filtros o la lista de infracciones
  useEffect(() => {
    let result = [...infractions];

    // Búsqueda general
    if (filters.search.trim() !== '') {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.ticket_number?.toLowerCase().includes(search) ||
          item.location?.toLowerCase().includes(search) ||
          item.driver_name?.toLowerCase().includes(search) ||
          item.driver_identification?.toLowerCase().includes(search) ||
          item.vehicle_plate?.toLowerCase().includes(search) ||
          item.infractions?.toLowerCase().includes(search)
      );
    }

    // Filtro por estado
    if (filters.status !== '') {
      result = result.filter((item) => item.status === filters.status);
    }

    // Filtro por fecha inicial
    if (filters.startDate) {
      result = result.filter(
        (item) => new Date(item.issue_timestamp) >= new Date(filters.startDate)
      );
    }

    // Filtro por fecha final
    if (filters.endDate) {
      result = result.filter(
        (item) => new Date(item.issue_timestamp) <= new Date(filters.endDate + 'T23:59:59')
      );
    }

    setFilteredInfractions(result);
  }, [filters, infractions]);

  // Función para manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchInfractions = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Obtener el oficial asociado al usuario actual
      const officerResponse = await api.get(`/officers/user/${user.id}`);
      if (officerResponse.data.status !== 200) {
        setError('No se encontró un oficial asociado a este usuario');
        setLoading(false);
        return;
      }

      const officer = officerResponse.data.message;
      const officerId = officer.id_officer;

      // 2. Obtener todas las multas (sin filtros) del oficial
      const ticketsResponse = await api.get(`/tickets/officer/${officerId}`);
      if (ticketsResponse.data.status === 200) {
        const tickets = ticketsResponse.data.message || [];
        setInfractions(tickets);
      } else {
        setInfractions([]);
      }
    } catch (error) {
      console.error('Error cargando multas:', error);
      setError('Error al cargar las multas. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Mapeo de estados a colores y etiquetas
  const getStatusColor = (status) => {
    const colors = {
      Pending: 'warning',
      Paid: 'success',
      Cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      Pending: '⏳ Pendiente',
      Paid: '✅ Pagada',
      Cancelled: '❌ Anulada',
    };
    return labels[status] || status;
  };

  // Calcular monto en Bs
  const calcularMonto = (ticket) => {
    const totalUt = parseFloat(ticket.total_ut) || 0;
    const valorUt = parseFloat(ticket.ut_daily_value_bs) || 0;
    return totalUt * valorUt;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabecera */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Mis Multas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Consulta el historial de todas las multas que has emitido.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchInfractions}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Barra de filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Buscar multas
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Buscar"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Boleta, lugar, conductor, placa..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha Desde"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha Hasta"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Estado"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pending">Pendiente</MenuItem>
                  <MenuItem value="Paid">Pagada</MenuItem>
                  <MenuItem value="Cancelled">Anulada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Cargando multas...
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell>
                  <strong>N° Boleta</strong>
                </TableCell>
                <TableCell>
                  <strong>Fecha</strong>
                </TableCell>
                <TableCell>
                  <strong>Lugar</strong>
                </TableCell>
                <TableCell>
                  <strong>Monto (Bs)</strong>
                </TableCell>
                <TableCell>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInfractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron multas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInfractions.map((item) => (
                  <TableRow key={item.id_ticket} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {item.ticket_number}
                    </TableCell>
                    <TableCell>
                      {new Date(item.issue_timestamp).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      Bs {calcularMonto(item).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(item.status)}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {/* Ver detalle */}
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/infractions/${item.id_ticket}`)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {/* Editar */}
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() =>
                            navigate(`/admin/infractions/edit/${item.id_ticket}`)
                          }
                        >
                          <EditIcon />
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

      {/* Resumen */}
      {!loading && filteredInfractions.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`Total: ${filteredInfractions.length}`}
            color="primary"
          />
          <Chip
            label={`Pendientes: ${
              filteredInfractions.filter((i) => i.status === 'Pending').length
            }`}
            color="warning"
          />
          <Chip
            label={`Pagadas: ${
              filteredInfractions.filter((i) => i.status === 'Paid').length
            }`}
            color="success"
          />
          <Chip
            label={`Anuladas: ${
              filteredInfractions.filter((i) => i.status === 'Cancelled').length
            }`}
            color="error"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyInfractions;