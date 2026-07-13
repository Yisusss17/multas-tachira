import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../api/axios'; // Asegúrate de que la ruta sea correcta

const ReglamentoPage = () => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfractions = async () => {
      try {
        const response = await api.get('/public/regulations');
        if (response.data.status === 200) {
          setInfractions(response.data.message);
        } else {
          setError('No se pudieron cargar las infracciones');
        }
      } catch (err) {
        console.error('Error cargando reglamento:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchInfractions();
  }, []);

  // Clasificar por severidad
  const classifyBySeverity = () => {
    const high = infractions.filter(item => item.ut_quantity >= 30);
    const medium = infractions.filter(item => item.ut_quantity >= 20 && item.ut_quantity < 30);
    const low = infractions.filter(item => item.ut_quantity < 20);
    return { high, medium, low };
  };

  const { high, medium, low } = classifyBySeverity();

  // Función para renderizar cada sección
  const renderSection = (items, title, cost, colorClass, chipColor) => {
    if (items.length === 0) return null;

    return (
      <Box className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <Box className={`px-6 py-4 flex items-center justify-between border-b border-gray-200 ${colorClass}`}>
          <Box className="flex items-center gap-2">
            <span className="material-symbols-outlined font-bold">warning</span>
            <Typography variant="h6" className="font-extrabold uppercase tracking-wider text-sm md:text-base">
              {title}
            </Typography>
          </Box>
          <Chip
            label={`${cost} U.T.`}
            style={{ fontWeight: 800, ...chipColor }}
          />
        </Box>

        <TableContainer component={Paper} className="shadow-none border-none">
          <Table>
            <TableHead className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableCell className="font-extrabold text-xs text-gray-500 uppercase tracking-wider px-6 py-3" style={{ width: '30%' }}>
                  Infracción
                </TableCell>
                <TableCell className="font-extrabold text-xs text-gray-500 uppercase tracking-wider px-6 py-3">
                  Descripción
                </TableCell>
                <TableCell className="font-extrabold text-xs text-gray-500 uppercase tracking-wider px-6 py-3" align="right">
                  U.T.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-bold text-tachira-black px-6 py-4">
                    {item.violation_description}
                  </TableCell>
                  <TableCell className="text-gray-600 px-6 py-4">
                    {item.violation_description} {/* Puedes tener una columna de descripción separada si existe */}
                  </TableCell>
                  <TableCell align="right" className="px-6 py-4 font-semibold">
                    {item.ut_quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-12 text-center">
        <CircularProgress />
        <Typography variant="body1" className="mt-4">Cargando reglamento...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (infractions.length === 0) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Alert severity="info">No hay infracciones registradas en el sistema.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-12 fade-in">
      <Box className="text-center mb-12 max-w-2xl mx-auto">
        <Typography variant="h3" className="font-extrabold text-tachira-black mb-3">
          Reglamento de Circulación
        </Typography>
        <Typography variant="body1" className="text-gray-500">
          Consulte la clasificación de las multas de tránsito vigentes, organizadas según su severidad y el costo asignado en Unidades Tributarias (U.T.).
        </Typography>
      </Box>

      {renderSection(
        high,
        'SEVERIDAD ALTA',
        '30',
        'bg-red-50 border-red-200 text-red-700',
        { backgroundColor: '#D32F2F', color: '#FFF' }
      )}

      {renderSection(
        medium,
        'SEVERIDAD MEDIA',
        '20',
        'bg-amber-50 border-amber-200 text-amber-800',
        { backgroundColor: '#FFB800', color: '#1A1A1A' }
      )}

      {renderSection(
        low,
        'SEVERIDAD BAJA',
        '10',
        'bg-gray-100 border-gray-300 text-gray-700',
        { backgroundColor: '#9E9E9E', color: '#FFF' }
      )}
    </Container>
  );
};

export default ReglamentoPage;