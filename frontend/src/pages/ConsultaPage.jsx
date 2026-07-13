import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ConsultaPage = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('plate');
  const [queryVal, setQueryVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!queryVal.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint =
        searchType === 'plate'
          ? `/public/search/plate/${queryVal.trim()}`
          : `/public/search/identification/${queryVal.trim()}`;

      const response = await api.get(endpoint);
      const { type, message } = response.data;

      if (type === 'Successfully') {
        navigate('/resultados', {
          state: {
            type: searchType,
            query: queryVal.trim(),
            data: message,
          },
        });
      } else {
        setErrorMsg(response.data.message || 'No se encontraron registros');
      }
    } catch (error) {
      console.error('Error buscando:', error);
      setErrorMsg(
        error.response?.data?.message ||
          'Infracciones no encontradas para los datos provistos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="py-12 fade-in">
      {/* ========================================================= */}
      {/* ENCABEZADO INSTITUCIONAL */}
      {/* ========================================================= */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #0f172a, #1e293b)',
          color: 'white',
          borderRadius: 3,
          p: 5,
          mb: 6,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            color: '#FFD54F',
            fontWeight: 700,
          }}
        >
          SERVICIO DIGITAL
        </Typography>

        <Typography variant="h3" fontWeight={800} mt={1} mb={2}>
          Consulta Ciudadana de Infracciones
        </Typography>

        <Typography maxWidth={700} color="grey.300">
          Consulte las infracciones registradas en el Sistema Integral de
          Gestión de Multas del Estado Táchira mediante el número de cédula o la
          placa del vehículo.
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* ALERTA DE CONFIANZA */}
      {/* ========================================================= */}
      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        Esta consulta es completamente gratuita y está disponible las 24 horas
        del día.
      </Alert>

      {/* ========================================================= */}
      {/* TARJETAS DE SELECCIÓN (mejoradas) */}
      {/* ========================================================= */}
      <Grid container spacing={3} className="mb-8 justify-center">
        <Grid item xs={6} sm={5}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border:
                searchType === 'plate'
                  ? '2px solid #FFD54F'
                  : '1px solid #ddd',
              transition: '0.25s',
              '&:hover': {
                boxShadow: 5,
              },
            }}
            onClick={() => {
              setSearchType('plate');
              setQueryVal('');
              setErrorMsg('');
            }}
          >
            <CardContent sx={{ py: 5, textAlign: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 55, color: '#1e293b' }}
              >
                directions_car
              </span>
              <Typography variant="h6" fontWeight={700} mt={1}>
                Por Placa
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={5}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border:
                searchType === 'id'
                  ? '2px solid #FFD54F'
                  : '1px solid #ddd',
              transition: '0.25s',
              '&:hover': {
                boxShadow: 5,
              },
            }}
            onClick={() => {
              setSearchType('id');
              setQueryVal('');
              setErrorMsg('');
            }}
          >
            <CardContent sx={{ py: 5, textAlign: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 55, color: '#1e293b' }}
              >
                badge
              </span>
              <Typography variant="h6" fontWeight={700} mt={1}>
                Por Cédula
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========================================================= */}
      {/* FORMULARIO MEJORADO */}
      {/* ========================================================= */}
      <Card className="border border-gray-200 max-w-xl mx-auto shadow-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-5">
            <Typography
              variant="subtitle2"
              className="font-extrabold text-tachira-black uppercase tracking-wider text-xs"
            >
              Datos para la consulta
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={1}>
              Complete el siguiente formulario utilizando la información
              solicitada.
            </Typography>

            <TextField
              fullWidth
              label={
                searchType === 'plate' ? 'Placa del Vehículo' : 'Número de Cédula'
              }
              placeholder={
                searchType === 'plate' ? 'Ej: PDM3436' : 'Ej: 12345678'
              }
              variant="outlined"
              value={queryVal}
              onChange={(e) => setQueryVal(e.target.value)}
              required
              disabled={loading}
              helperText={
                searchType === 'plate'
                  ? 'Formatos permitidos: Venezolanos tradicionales (Ej. PDM3436)'
                  : 'Ingrese solo dígitos numéricos correspondientes al documento de identidad'
              }
            />

            <Collapse in={!!errorMsg}>
              <Alert severity="warning" className="font-semibold text-sm">
                {errorMsg}
              </Alert>
            </Collapse>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                bgcolor: '#FFD54F',
                color: '#1e293b',
                '&:hover': {
                  bgcolor: '#f5c842',
                },
              }}
              startIcon={
                loading ? (
                  <span className="material-symbols-outlined animate-spin">
                    sync
                  </span>
                ) : (
                  <span className="material-symbols-outlined">search</span>
                )
              }
            >
              {loading ? 'Consultando...' : 'Buscar'}
            </Button>

            {/* ========================================================= */}
            {/* NOTA LEGAL */}
            {/* ========================================================= */}
            <Box mt={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
              >
                La información mostrada corresponde a los registros disponibles
                en la base de datos institucional del Sistema Integral de
                Gestión de Multas del Estado Táchira.
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ConsultaPage;