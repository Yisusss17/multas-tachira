import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Divider, Button } from '@mui/material';
import StatusChip from '../common/StatusChip';

// Helper to format Date
const formatDate = (isoString) => {
  if (!isoString) return 'Fecha no disponible';
  const d = new Date(isoString);
  return d.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper for time ago
const timeAgo = (isoString) => {
  if (!isoString) return '';
  const seconds = Math.floor((new Date() - new Date(isoString)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `Hace ${interval} año(s)`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `Hace ${interval} mes(es)`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `Hace ${interval} día(s)`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `Hace ${interval} hora(s)`;
  return 'Recientemente';
};

const TicketCard = ({ ticket }) => {
  // Safe extraction of nested structures
  const ticketNumber = ticket.ticket_number || `ID ${ticket.id_ticket}`;
  const status = ticket.status || 'No pagada';
  const timeLabel = timeAgo(ticket.issue_timestamp);
  const dateLabel = formatDate(ticket.issue_timestamp);
  const location = ticket.location || 'No especificada';
  const observations = ticket.observations || 'Sin observaciones adicionales';
  const plate = ticket.vehicle_plate || 'Sin placa';
  const vehicleDesc = `${ticket.vehicle_brand || ''} ${ticket.vehicle_model || ''} (${ticket.vehicle_color || ''})`.trim() || 'Vehículo no registrado';

  // Infractions text compilation
  const infractionsText = ticket.details && ticket.details.length > 0
    ? ticket.details.map(d => d.violation_description).join(', ')
    : 'Infracción no especificada';

  // Cost calculation
  // Total UT * UT daily value = Bs
  const totalUt = parseFloat(ticket.total_ut || 0);
  const utVal = parseFloat(ticket.ut_daily_value_bs || 9.0);
  const totalBs = (totalUt * utVal).toFixed(2);

  // Approximate USD conversion for modern feel (assume ~36 Bs/$) or show both
  const approxUsd = (parseFloat(totalBs) / 40.0).toFixed(2); // Example static conversion to display USD value

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden border-l-4 border-l-tachira-yellow">
      <CardContent className="p-6">
        {/* Top Header */}
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Box>
            <Typography variant="h6" className="font-bold text-tachira-black flex items-center gap-2">
              <span className="material-symbols-outlined text-tachira-yellow text-xl">receipt_long</span>
              Boleta N° {ticketNumber}
            </Typography>
            {timeLabel && (
              <Typography variant="caption" className="text-gray-500 font-medium">
                {timeLabel}
              </Typography>
            )}
          </Box>
          <StatusChip status={status} />
        </Box>

        <Divider className="my-3" />

        {/* Detailed Grid Info */}
        <Grid container spacing={3} className="my-1">
          {/* Left info column */}
          <Grid item xs={12} md={7}>
            <Box className="flex flex-col gap-4">
              {/* Lugar */}
              <Box className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 mt-1">pin_drop</span>
                <Box>
                  <Typography variant="caption" className="text-gray-400 block font-bold uppercase tracking-wider">
                    Lugar de Infracción
                  </Typography>
                  <Typography variant="body2" className="text-tachira-black font-semibold">
                    {location}
                  </Typography>
                </Box>
              </Box>

              {/* Artículo violentado */}
              <Box className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 mt-1">gavel</span>
                <Box>
                  <Typography variant="caption" className="text-gray-400 block font-bold uppercase tracking-wider">
                    Infracción / Artículo
                  </Typography>
                  <Typography variant="body2" className="text-tachira-black font-semibold">
                    {infractionsText}
                  </Typography>
                </Box>
              </Box>

              {/* Placa de vehículo */}
              <Box className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 mt-1">directions_car</span>
                <Box>
                  <Typography variant="caption" className="text-gray-400 block font-bold uppercase tracking-wider">
                    Vehículo
                  </Typography>
                  <Typography variant="body2" className="text-tachira-black font-semibold">
                    Placa: <span className="bg-tachira-yellowLight px-2 py-0.5 rounded font-bold text-tachira-blackSoft">{plate}</span>
                  </Typography>
                  {vehicleDesc && (
                    <Typography variant="caption" className="text-gray-500 block">
                      {vehicleDesc}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Fecha y hora */}
              <Box className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 mt-1">calendar_today</span>
                <Box>
                  <Typography variant="caption" className="text-gray-400 block font-bold uppercase tracking-wider">
                    Fecha y Hora de Emisión
                  </Typography>
                  <Typography variant="body2" className="text-tachira-black font-semibold">
                    {dateLabel}
                  </Typography>
                </Box>
              </Box>

              {/* Observaciones */}
              <Box className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-500 mt-1">assignment</span>
                <Box>
                  <Typography variant="caption" className="text-gray-400 block font-bold uppercase tracking-wider">
                    Observaciones del Oficial
                  </Typography>
                  <Typography variant="body2" className="text-gray-700 italic">
                    &quot;{observations}&quot;
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right info column: Image & Cost */}
          <Grid item xs={12} md={5} className="flex flex-col justify-between gap-4">
            {/* Cost calculation */}
            <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Typography variant="caption" className="text-gray-500 block font-bold uppercase tracking-wider mb-1">
                Monto Total a Pagar
              </Typography>
              <Typography variant="h4" className="font-extrabold text-tachira-black">
                Bs. {totalBs}
              </Typography>
              <Box className="flex justify-between items-center mt-1">
                <Typography variant="body2" className="text-gray-500 font-semibold">
                  {totalUt} U.T.
                </Typography>
                <Typography variant="caption" className="text-gray-400 font-medium italic">
                  Ref. ~${approxUsd} USD
                </Typography>
              </Box>
            </Box>

            {/* Evidence image placeholder */}
            <Box className="relative border border-gray-200 rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400 text-4xl">photo_camera</span>
              <Box className="absolute bottom-0 w-full bg-black/60 text-white text-center py-1">
                <Typography variant="caption" className="font-bold uppercase tracking-wider">
                  Evidencia Registrada
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Action Button for Unpaid Tickets */}
        {status?.toLowerCase() !== 'pagada' && status?.toLowerCase() !== 'paid' && (
          <Box className="mt-4 flex justify-end">
            <Button 
              variant="contained" 
              color="secondary"
              className="bg-tachira-black hover:bg-tachira-blackSoft text-white font-bold"
              startIcon={<span className="material-symbols-outlined">payments</span>}
              onClick={() => alert('Pasarela de pago móvil Táchira en desarrollo')}
            >
              Pagar Infracción
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketCard;
