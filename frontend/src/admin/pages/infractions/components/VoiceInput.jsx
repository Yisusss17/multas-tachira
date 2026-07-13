// frontend/src/admin/pages/infractions/components/VoiceInput.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  Paper,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const VoiceInput = ({ onCedulaDetectada, loading }) => {
  const [texto, setTexto] = useState('');
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState('');
  const [cedula, setCedula] = useState('');
  const [busquedaManual, setBusquedaManual] = useState('');

  const iniciarReconocimiento = () => {
    setError('');
    setTexto('');
    setCedula('');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'es-VE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setEscuchando(true);

    recognition.onend = () => setEscuchando(false);

    recognition.onresult = (event) => {
      const resultado = event.results[0][0].transcript;

      console.log("Texto reconocido:", resultado);

      setTexto(resultado);

      // Convertir el texto a minúsculas
      let textoProcesado = resultado.toLowerCase();

      // Reemplazar números escritos por dígitos
      const mapa = {
        cero: "0",
        uno: "1",
        dos: "2",
        tres: "3",
        cuatro: "4",
        cinco: "5",
        seis: "6",
        siete: "7",
        ocho: "8",
        nueve: "9",
      };

      Object.keys(mapa).forEach((palabra) => {
        textoProcesado = textoProcesado.replace(
          new RegExp(`\\b${palabra}\\b`, "g"),
          mapa[palabra]
        );
      });

      // Eliminar todo lo que no sea número
      const soloNumeros = textoProcesado.replace(/\D/g, "");

      console.log("Solo números:", soloNumeros);

      if (soloNumeros.length >= 6 && soloNumeros.length <= 10) {
        const cedulaFinal = `V-${soloNumeros}`;

        setCedula(cedulaFinal);

        if (onCedulaDetectada) {
          onCedulaDetectada(cedulaFinal);
        }
      } else {
        setError("No se reconoció una cédula válida (6 a 10 dígitos)");
      }
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento:", event.error);

      if (event.error === "not-allowed") {
        setError("Permiso de micrófono denegado.");
      } else if (event.error === "no-speech") {
        setError(
          "No se detectó voz. Intente hablar más cerca del micrófono."
        );
      } else {
        setError("Error al capturar voz. Intente nuevamente.");
      }

      setEscuchando(false);
    };

    recognition.start();
  };

  const handleBusquedaManual = () => {
    if (!busquedaManual.trim()) return;

    setError('');

    const limpia = busquedaManual.replace(/\D/g, '');

    if (limpia.length >= 6) {
      const cedulaFinal = `V-${limpia}`;

      setCedula(cedulaFinal);

      if (onCedulaDetectada) {
        onCedulaDetectada(cedulaFinal);
      }
    } else {
      setError('Ingrese una cédula válida (mínimo 6 dígitos)');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBusquedaManual();
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <PersonSearchIcon color="primary" />
        Capturar Cédula
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Puede dictar la cédula por voz o escribirla manualmente
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          startIcon={escuchando ? <MicOffIcon /> : <MicIcon />}
          onClick={iniciarReconocimiento}
          disabled={escuchando || loading}
          sx={{
            bgcolor: escuchando ? 'error.main' : 'primary.main',
            '&:hover': {
              bgcolor: escuchando ? 'error.dark' : 'primary.dark',
            },
            minWidth: '140px',
          }}
        >
          {escuchando ? 'Escuchando...' : '🎙️ Dictar'}
        </Button>

        <TextField
          size="small"
          placeholder="Ej: V-12345678"
          value={busquedaManual}
          onChange={(e) => setBusquedaManual(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <Chip
                  label="V-"
                  size="small"
                  sx={{
                    mr: 1,
                    bgcolor: 'primary.light',
                    color: 'white',
                  }}
                />
              ),
            },
          }}
        />

        <Button
          variant="outlined"
          onClick={handleBusquedaManual}
          disabled={loading || !busquedaManual.trim()}
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>
      </Stack>

      {escuchando && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            Escuchando... Hable claramente el número de cédula
          </Typography>
        </Box>
      )}

      {texto && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2">
            <strong>Texto reconocido:</strong> {texto}
          </Typography>
        </Paper>
      )}

      {cedula && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Cédula detectada:</strong> {cedula}
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default VoiceInput;