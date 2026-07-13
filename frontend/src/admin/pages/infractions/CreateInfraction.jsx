// frontend/src/admin/pages/infractions/CreateInfraction.jsx
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';
import VoiceInput from './components/VoiceInput';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const CreateInfraction = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Datos del conductor y vehículo
  const [cedula, setCedula] = useState('');
  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [vehiclesDisponibles, setVehiclesDisponibles] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [vehicleSeleccionadoId, setVehicleSeleccionadoId] = useState(null);
  const [officer, setOfficer] = useState(null);

  // Catálogo de infracciones
  const [infractions, setInfractions] = useState([]);

  // Catálogo de condiciones del infractor
  const [conditions, setConditions] = useState([]);

  // Datos de la multa
  const [ticketNumber, setTicketNumber] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [lugar, setLugar] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [observations, setObservations] = useState('');
  const [utDailyValue, setUtDailyValue] = useState(0.50);
  const [infraccionesSeleccionadas, setInfraccionesSeleccionadas] = useState([]);

  // Estados para selección de infracción
  const [infraccionSeleccionada, setInfraccionSeleccionada] = useState('');


  // Estados para búsqueda por placa
  const [busquedaPorPlaca, setBusquedaPorPlaca] = useState(false);
  const [placaBusqueda, setPlacaBusqueda] = useState('');
  const [propietario, setPropietario] = useState(null);
  const [infractorSeleccionado, setInfractorSeleccionado] = useState('conductor');
  const [loadingPlaca, setLoadingPlaca] = useState(false);

  useEffect(() => {
    cargarCatalogos();
    obtenerOfficer();
    obtenerUtDailyValue();
  }, []);

  useEffect(() => {
    if (driver && vehicle && !ticketNumber) {
      generarNumeroTicket();
    }
  }, [driver, vehicle]);

  const cargarCatalogos = async () => {
    try {
      const infractionsRes = await api.get('/infractions');
      if (infractionsRes.data.status === 200) {
        setInfractions(infractionsRes.data.message);
      }

      const conditionsRes = await api.get('/offender-conditions');
      if (conditionsRes.data.status === 200) {
        setConditions(conditionsRes.data.message);
      }
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      setError('Error al cargar los datos del sistema');
    }
  };

  const obtenerOfficer = async () => {
    try {
      const response = await api.get(`/officers/user/${user.id}`);
      if (response.data.status === 200) {
        setOfficer(response.data.message);
      } else {
        setError('No se encontró asignación de oficial para este usuario');
      }
    } catch (error) {
      console.error('Error obteniendo oficial:', error);
    }
  };

  const obtenerUtDailyValue = async () => {
    try {
      const response = await api.get('/settings/ut-daily-value');
      if (response.data.status === 200) {
        setUtDailyValue(response.data.message.value || 0.50);
      }
    } catch (error) {
      console.log('Usando valor UT por defecto');
    }
  };

  const generarNumeroTicket = async () => {
    try {
      const response = await api.get('/tickets/last');
      if (response.data.status === 200 && response.data.message) {
        const ultimo = response.data.message.ticket_number;
        const numero = parseInt(ultimo.replace('MUL', '')) + 1;
        setTicketNumber(`MUL${String(numero).padStart(3, '0')}`);
      } else {
        setTicketNumber('MUL001');
      }
    } catch (error) {
      console.error('Error generando ticket:', error);
      setTicketNumber('MUL001');
    }
  };

  const buscarDriverYVehiculo = async (cedulaDetectada) => {
    setLoading(true);
    setError('');
    setDriver(null);
    setVehicle(null);
    setVehiclesDisponibles([]);
    setDriverId(null);

    try {
      const driverResponse = await api.get(`/drivers/identification/${cedulaDetectada}`);

      if (driverResponse.data.status !== 200) {
        setError('Conductor no encontrado en la base de datos');
        return;
      }

      const driverData = driverResponse.data.message;
      setDriverId(driverData.id_driver);

      setDriver({
        nombre: driverData.first_name,
        apellido: driverData.last_name,
        cedula: driverData.identification,
        direccion: driverData.address,
        telefono: driverData.phone,
        correo: driverData.email,
        fecha_nacimiento: driverData.birth_date,
        status: driverData.status
      });

      const vehiclesResponse = await api.get(`/vehicles/driver/${driverData.id_driver}`);
      const vehicles = vehiclesResponse.data.status === 200 ? vehiclesResponse.data.message : [];

      if (vehicles.length === 0) {
        setBusquedaPorPlaca(true);
        setActiveStep(1);
        return;
      }

      setVehiclesDisponibles(vehicles);

      const vehicleDefault = vehicles[0];
      setVehicleSeleccionadoId(vehicleDefault.id_vehicle);

      setVehicle({
        ...vehicleDefault,
        tipo_nombre: vehicleDefault.vehicle_type_name || 'Automóvil'
      });

      setActiveStep(1);

    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Error al buscar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCedulaDetectada = (cedulaDetectada) => {
    setCedula(cedulaDetectada);
    buscarDriverYVehiculo(cedulaDetectada);
  };

  const handleCambiarVehiculo = (vehicleId) => {
    const selected = vehiclesDisponibles.find(v => v.id_vehicle === parseInt(vehicleId));
    if (selected) {
      setVehicleSeleccionadoId(selected.id_vehicle);
      setVehicle({
        ...selected,
        tipo_nombre: selected.vehicle_type_name || 'Automóvil'
      });
    }
  };

  const buscarVehiculoPorPlaca = async () => {
    const plate = placaBusqueda.trim();
    if (!plate) return;
    setLoadingPlaca(true);
    setError('');
    
    try {
      const normalizedPlate = encodeURIComponent(plate.toUpperCase());
      const response = await api.get(`/vehicles/plate/${normalizedPlate}`);
      if (response.data.status === 200 && response.data.message) {
        const v = response.data.message;
        setVehicleSeleccionadoId(v.id_vehicle);
        setVehicle({
          ...v,
          tipo_nombre: v.vehicle_type_name || 'Automóvil'
        });

        const propData = {
          nombre: v.owner_first_name,
          apellido: v.owner_last_name,
          cedula: v.owner_identification,
          telefono: v.owner_phone,
          correo: v.owner_email,
          id_driver: v.id_driver,
          direccion: v.owner_address
        };

        setPropietario(propData);

        if (propData.cedula === driver.cedula) {
          setInfractorSeleccionado('conductor');
        } else {
          setInfractorSeleccionado('');
        }
      } else {
        setError('Vehículo no encontrado. Verifique la placa e intente nuevamente.');
      }
    } catch (err) {
      console.error('Error buscando vehículo:', err);
      setError('Vehículo no encontrado. Verifique la placa e intente nuevamente.');
    } finally {
      setLoadingPlaca(false);
    }
  };

  const handleAgregarInfraccion = () => {
   if (!infraccionSeleccionada) {
  setError('Seleccione una infracción');
  return;
}

    const infraccion = infractions.find(i => i.infraction_id === parseInt(infraccionSeleccionada));
    if (!infraccion) {
      setError('Infracción no encontrada');
      return;
    }

    const nuevoItem = {
  infraction_id: infraccion.infraction_id,
  violation_description: infraccion.violation_description,
  ut_por_infraccion: Number(infraccion.ut_quantity),
  total_ut: Number(infraccion.ut_quantity)
};

    setInfraccionesSeleccionadas([...infraccionesSeleccionadas, nuevoItem]);
    setInfraccionSeleccionada('');
    
    setError('');
  };

  const handleEliminarInfraccion = (index) => {
    const nuevas = infraccionesSeleccionadas.filter((_, i) => i !== index);
    setInfraccionesSeleccionadas(nuevas);
  };

  const totalUT = infraccionesSeleccionadas.reduce((acc, cur) => acc + cur.total_ut, 0);
  const totalBs = totalUT * utDailyValue;

  const handleEnviarMulta = async () => {
    if (!driver || !vehicle || infraccionesSeleccionadas.length === 0) {
      setError('Debe completar todos los datos y agregar al menos una infracción');
      return;
    }

    if (!officer) {
      setError('No se encontró asignación del oficial');
      return;
    }

    if (!conditionId) {
      setError('Seleccione la condición del infractor');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const ticketData = {
        ticket_number: ticketNumber,
        id_officer: officer.id_officer,
        id_driver: infractorSeleccionado === 'propietario' ? propietario.id_driver : driverId,
        id_vehicle: vehicleSeleccionadoId,
        id_condition: parseInt(conditionId),
        location: lugar,
        issue_timestamp: `${fecha}T${hora}:00`,
        status: 'Pending',
        observations: observations,
        ut_daily_value_bs: utDailyValue,
        total_ut: totalUT
      };

      const response = await api.post('/tickets', ticketData);

      if (response.data.status === 201) {
       const ticketId = response.data.message.id_ticket;

for (const item of infraccionesSeleccionadas) {

  const detalle = {
    id_ticket: ticketId,
    infraction_id: item.infraction_id
  };

  await api.post('/ticket-details', detalle);

}

        setSuccess('✅ Multa registrada exitosamente');

        setInfraccionesSeleccionadas([]);
        setLugar('');
        setObservations('');
        setConditionId('');
        setActiveStep(0);
        generarNumeroTicket();
        setDriver(null);
        setVehicle(null);
        setVehiclesDisponibles([]);
        setDriverId(null);
        setBusquedaPorPlaca(false);
        setPlacaBusqueda('');
        setPropietario(null);
        setInfractorSeleccionado('conductor');

      } else {
        setError('Error al registrar: ' + JSON.stringify(response.data.message));
      }
    } catch (error) {
      console.error('Error:', error);

      let errorMsg = 'Error de conexión con el servidor';
      const errorData = error.response?.data;

      if (errorData) {
        if (typeof errorData.message === 'string') {
          errorMsg = errorData.message;
        } else if (Array.isArray(errorData.message)) {
          errorMsg = errorData.message.map(e => e.message).join(', ');
        } else if (typeof errorData.message === 'object') {
          errorMsg = JSON.stringify(errorData.message);
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        Registrar Nueva Infracción
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete los datos del conductor, vehículo y las infracciones aplicadas
      </Typography>

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

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step><StepLabel>1. Capturar Cédula</StepLabel></Step>
        <Step><StepLabel>2. Verificar Datos</StepLabel></Step>
        <Step><StepLabel>3. Registrar Infracción</StepLabel></Step>
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <VoiceInput onCedulaDetectada={handleCedulaDetectada} loading={loading} />
          </Paper>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>Buscando datos...</Typography>
            </Box>
          )}

          {driver && (
            <Card sx={{ mb: 3, borderLeft: '4px solid #1976d2' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  👤 Conductor
                  <Chip
                    label={driver.status}
                    size="small"
                    color={driver.status === 'Active' ? 'success' : 'error'}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Nombre:</strong> {driver.nombre} {driver.apellido}</Typography>
                  <Typography variant="body2"><strong>Cédula:</strong> {driver.cedula}</Typography>
                  <Typography variant="body2"><strong>Dirección:</strong> {driver.direccion}</Typography>
                  <Typography variant="body2"><strong>Teléfono:</strong> {driver.telefono}</Typography>
                  <Typography variant="body2"><strong>Correo:</strong> {driver.correo}</Typography>
                  <Typography variant="body2"><strong>Fecha Nac.:</strong> {driver.fecha_nacimiento}</Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {busquedaPorPlaca && !vehicle && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                El conductor no tiene vehículos registrados. Puede buscar un vehículo por su placa.
              </Alert>
              <Paper sx={{ p: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Placa del vehículo"
                  value={placaBusqueda}
                  onChange={(e) => setPlacaBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarVehiculoPorPlaca()}
                  disabled={loadingPlaca}
                />
                <Button 
                  variant="contained" 
                  onClick={buscarVehiculoPorPlaca}
                  disabled={loadingPlaca || !placaBusqueda.trim()}
                  sx={{ minWidth: '100px' }}
                >
                  {loadingPlaca ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                </Button>
              </Paper>
            </Box>
          )}

          {vehicle && (
            <Card sx={{ mb: 3, borderLeft: '4px solid #2e7d32' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🚗 Vehículo
                  <Chip
                    label={vehicle.status}
                    size="small"
                    color={vehicle.status === 'Active' ? 'success' : 'error'}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Placa:</strong> {vehicle.plate}</Typography>
                  <Typography variant="body2"><strong>Marca:</strong> {vehicle.brand}</Typography>
                  <Typography variant="body2"><strong>Modelo:</strong> {vehicle.model}</Typography>
                  <Typography variant="body2"><strong>Color:</strong> {vehicle.color}</Typography>
                  <Typography variant="body2"><strong>Tipo:</strong> {vehicle.tipo_nombre}</Typography>
                  <Typography variant="body2"><strong>Año:</strong> {vehicle.year}</Typography>
                </Stack>

                {vehiclesDisponibles.length > 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cambiar vehículo:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                      {vehiclesDisponibles.map((v) => (
                        <Chip
                          key={v.id_vehicle}
                          label={`${v.plate} - ${v.brand}`}
                          onClick={() => handleCambiarVehiculo(v.id_vehicle)}
                          color={vehicleSeleccionadoId === v.id_vehicle ? 'primary' : 'default'}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {busquedaPorPlaca && propietario && propietario.cedula !== driver.cedula && (
            <Card sx={{ mb: 3, borderLeft: '4px solid #ed6c02' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📝 Propietario del Vehículo
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="body2"><strong>Nombre:</strong> {propietario.nombre} {propietario.apellido}</Typography>
                  <Typography variant="body2"><strong>Cédula:</strong> {propietario.cedula}</Typography>
                  <Typography variant="body2"><strong>Teléfono:</strong> {propietario.telefono}</Typography>
                  <Typography variant="body2"><strong>Correo:</strong> {propietario.correo}</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>
                  Seleccione el infractor:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label="Conductor actual" 
                    onClick={() => setInfractorSeleccionado('conductor')}
                    color={infractorSeleccionado === 'conductor' ? 'primary' : 'default'}
                    variant={infractorSeleccionado === 'conductor' ? 'filled' : 'outlined'}
                  />
                  <Chip 
                    label="Propietario del vehículo" 
                    onClick={() => setInfractorSeleccionado('propietario')}
                    color={infractorSeleccionado === 'propietario' ? 'warning' : 'default'}
                    variant={infractorSeleccionado === 'propietario' ? 'filled' : 'outlined'}
                  />
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Datos de la Multa
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Ticket"
                  value={ticketNumber}
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  size="small"
                
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  size="small"
                  
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lugar"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  size="small"
                  placeholder="Ej: Av. Principal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Conductor"
                  value={driver ? `${driver.nombre} ${driver.apellido}` : ''}
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehículo"
                  value={vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : ''}
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Condición del Infractor"
                  value={conditionId}
                  onChange={(e) => setConditionId(e.target.value)}
                  size="small"
                  
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  {conditions.map((cond) => (
                    <MenuItem key={cond.id_condition} value={cond.id_condition}>
                      {cond.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  size="small"
                  placeholder="Detalles adicionales sobre la infracción..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Agregar Infracción
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  select
                  label="Infracción"
                  value={infraccionSeleccionada}
                  onChange={(e) => setInfraccionSeleccionada(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  {infractions.map((inf) => (
                    <MenuItem key={inf.infraction_id} value={inf.infraction_id}>
                      {inf.violation_description} - {inf.ut_quantity} UT  {/* ← Cambiado: mostrar ut_quantity */}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAgregarInfraccion}
                  disabled={!infraccionSeleccionada}
                  sx={{ height: '100%', bgcolor: '#1976d2' }}
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>

            {infraccionesSeleccionadas.length > 0 && (
              <TableContainer sx={{ mt: 2 }}>
  <Table size="small">
    <TableHead sx={{ bgcolor: 'grey.100' }}>
      <TableRow>
        <TableCell><strong>#</strong></TableCell>
        <TableCell><strong>Infracción</strong></TableCell>
        <TableCell align="right"><strong>UT</strong></TableCell>
        <TableCell align="center"><strong>Acciones</strong></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>

      {infraccionesSeleccionadas.map((item, index) => (

        <TableRow key={index}>

          <TableCell>
            {index + 1}
          </TableCell>

          <TableCell>
            {item.violation_description}
          </TableCell>

          <TableCell align="right">
            {item.ut_por_infraccion.toFixed(2)} UT
          </TableCell>

          <TableCell align="center">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleEliminarInfraccion(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>

        </TableRow>

      ))}

      <TableRow sx={{ bgcolor: 'grey.50' }}>
        <TableCell colSpan={2} align="right" sx={{ fontWeight: 700 }}>
          TOTAL UT
        </TableCell>

        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {totalUT.toFixed(2)} UT
        </TableCell>

        <TableCell />
      </TableRow>

      <TableRow>
        <TableCell colSpan={2} align="right" sx={{ fontWeight: 700 }}>
          Valor UT (Bs)
        </TableCell>

        <TableCell align="right" sx={{ fontWeight: 700 }}>
          {utDailyValue.toFixed(2)} Bs
        </TableCell>

        <TableCell />
      </TableRow>

      <TableRow sx={{ bgcolor: 'grey.100' }}>
        <TableCell colSpan={2} align="right" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          TOTAL EN Bs
        </TableCell>

        <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main', fontSize: '1.1rem' }}>
          {totalBs.toFixed(2)} Bs
        </TableCell>

        <TableCell />
      </TableRow>

    </TableBody>
  </Table>
</TableContainer>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleEnviarMulta}
                disabled={!driver || !vehicle || infraccionesSeleccionadas.length === 0 || !conditionId || loading || (busquedaPorPlaca && propietario && propietario.cedula !== driver.cedula && !infractorSeleccionado)}
                sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, px: 4 }}
              >
                {loading ? 'Registrando...' : 'Registrar Multa'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateInfraction;