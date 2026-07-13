import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import TicketCard from '../components/tickets/TicketCard';

const ResultadosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, query, data } = location.state || {};

  // If page accessed directly, redirect back
  if (!query || !data) {
    return (
      <Container maxWidth="md" className="py-16 text-center">
        <Typography variant="h5" color="error" className="font-bold mb-4">
          Acceso no permitido
        </Typography>
        <Typography variant="body1" className="text-gray-500 mb-6">
          Por favor, realice la consulta desde la página correspondiente.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/consulta')}
          className="bg-tachira-yellow text-tachira-black font-bold"
        >
          Ir a Consulta
        </Button>
      </Container>
    );
  }

  const tickets = data.tickets || [];
  const totalTickets = data.total_tickets || 0;
  const vehicle = data.vehicle;
  const driver = data.driver;

  return (
    <Container maxWidth="md" className="py-10 fade-in">
      {/* Back Button and Identifier header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Button
          onClick={() => navigate('/consulta')}
          startIcon={<span className="material-symbols-outlined">arrow_back</span>}
          className="text-tachira-black hover:text-tachira-yellow font-bold"
        >
          Volver a Consulta
        </Button>

        <Box className="flex items-center gap-2 bg-tachira-black text-white px-4 py-2 rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-tachira-yellow">
            {type === 'plate' ? 'directions_car' : 'badge'}
          </span>
          <Typography variant="body2" className="font-bold uppercase tracking-wider">
            {type === 'plate' ? `Placa: ${query}` : `Cédula: ${query}`}
          </Typography>
        </Box>
      </Box>

      {/* Owner / Subject Header info */}
      <Box className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <Typography variant="h5" className="font-extrabold text-tachira-black mb-3">
          Información del Registro
        </Typography>
        {type === 'plate' && vehicle ? (
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Propietario:</span>{' '}
              <strong className="text-tachira-black">{vehicle.owner_name || 'Desconocido'}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Identificación:</span>{' '}
              <strong className="text-tachira-black">{vehicle.owner_identification || 'Desconocida'}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Tipo:</span>{' '}
              <strong className="text-tachira-black">{vehicle.vehicle_type_name || 'Desconocido'}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Especificación:</span>{' '}
              <strong className="text-tachira-black">{vehicle.brand} {vehicle.model} ({vehicle.color})</strong>
            </Typography>
          </Box>
        ) : driver ? (
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Conductor:</span>{' '}
              <strong className="text-tachira-black">{driver.first_name} {driver.last_name}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Identificación:</span>{' '}
              <strong className="text-tachira-black">{driver.identification}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Teléfono:</span>{' '}
              <strong className="text-tachira-black">{driver.phone || 'No registrado'}</strong>
            </Typography>
            <Typography variant="body2">
              <span className="text-gray-500 font-medium">Estado de Licencia:</span>{' '}
              <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-xs">
                {driver.status || 'Activo'}
              </span>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" className="text-gray-500">
            No hay información complementaria disponible.
          </Typography>
        )}
      </Box>

      {/* Fine list section */}
      <Box className="flex flex-col gap-6">
        <Box className="flex items-center gap-2 mb-2">
          <Typography variant="h6" className="font-extrabold text-tachira-black">
            Infracciones Detectadas
          </Typography>
          <span className="bg-tachira-yellow text-tachira-black font-extrabold px-2 py-0.5 rounded-full text-xs">
            {totalTickets}
          </span>
        </Box>

        {totalTickets === 0 ? (
          /* Clean state: No Fines! */
          <Box className="bg-green-50 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <Box className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-4xl font-extrabold">check_circle</span>
            </Box>
            <Typography variant="h5" className="font-bold text-green-800">
              Sin Infracciones Pendientes
            </Typography>
            <Typography variant="body2" className="text-green-600 max-w-sm">
              Felicitaciones. No se encontraron multas ni sanciones registradas asociadas a los datos provistos en el sistema del Estado Táchira.
            </Typography>
          </Box>
        ) : (
          /* Tickets Cards mapping */
          tickets.map((ticket) => (
            <TicketCard key={ticket.id_ticket} ticket={ticket} />
          ))
        )}
      </Box>
    </Container>
  );
};

export default ResultadosPage;
