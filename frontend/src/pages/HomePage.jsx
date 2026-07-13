import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: '¿Cómo puedo consultar si tengo multas pendientes?',
      a: 'Puede hacerlo directamente desde la sección "Consultar Infracciones" utilizando el número de cédula del conductor o la placa del vehículo.',
    },
    {
      q: '¿Dónde y cómo realizo el pago de una multa?',
      a: 'Una vez localizada la infracción, el sistema mostrará las opciones de pago autorizadas por la administración del Estado Táchira.',
    },
    {
      q: '¿Cuál es el valor de la Unidad Tributaria (U.T.) aplicada?',
      a: 'El valor utilizado corresponde al vigente para la fecha de emisión de la infracción conforme a la normativa aplicable.',
    },
  ];

  return (
    <Box className="fade-in">

      {/* ========================================================= */}
      {/* HERO INSTITUCIONAL */}
      {/* ========================================================= */}

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg,#08111f 0%, #111827 45%, #1f2937 100%)',
          borderBottom: '4px solid #F7C600',
        }}
      >
        {/* Fondo decorativo */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #FFD54F 2px, transparent 2px)',
            backgroundSize: '42px 42px',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            py: { xs: 10, md: 14 },
          }}
        >
          <Grid
            container
            spacing={8}
            alignItems="center"
          >
            {/* Lado izquierdo */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 10,
                  border: '1px solid rgba(247,198,0,.25)',
                  bgcolor: 'rgba(247,198,0,.08)',
                  mb: 4,
                }}
              >
                <span className="material-symbols-outlined text-tachira-yellow">
                  account_balance
                </span>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#F7C600',
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  Gobierno del Estado Táchira
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: '#FFF',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  mb: 4,
                  fontSize: {
                    xs: '2.3rem',
                    md: '3.8rem',
                  },
                }}
              >
                Sistema Oficial de

                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    color: '#F7C600',
                  }}
                >
                  Consulta de Infracciones
                </Box>

                de Tránsito
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#C8CDD5',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  maxWidth: 650,
                  mb: 5,
                }}
              >
                Plataforma institucional destinada a brindar a los ciudadanos
                acceso rápido, seguro y transparente a la información de
                infracciones registradas en el Estado Táchira mediante consulta
                por placa del vehículo o documento de identidad.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/consulta')}
                  className="bg-tachira-yellow hover:bg-tachira-yellowDark text-tachira-black font-bold"
                  startIcon={
                    <span className="material-symbols-outlined">
                      search
                    </span>
                  }
                >
                  Consultar Infracciones
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/reglamento')}
                  sx={{
                    color: '#FFF',
                    borderColor: '#6B7280',
                    '&:hover': {
                      borderColor: '#FFF',
                    },
                  }}
                  startIcon={
                    <span className="material-symbols-outlined">
                      gavel
                    </span>
                  }
                >
                  Reglamento
                </Button>
              </Box>
            </Grid>

            {/* Lado derecho */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 4,
                  color: '#FFF',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#F7C600',
                      letterSpacing: 2,
                      fontWeight: 700,
                    }}
                  >
                    CONSULTA CIUDADANA
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    <Box display="flex" gap={2}>
                      <span className="material-symbols-outlined text-green-400">
                        check_circle
                      </span>

                      <Typography>
                        Consulta por número de placa.
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2}>
                      <span className="material-symbols-outlined text-green-400">
                        check_circle
                      </span>

                      <Typography>
                        Consulta por documento de identidad.
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2}>
                      <span className="material-symbols-outlined text-green-400">
                        check_circle
                      </span>

                      <Typography>
                        Información oficial y actualizada.
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2}>
                      <span className="material-symbols-outlined text-green-400">
                        check_circle
                      </span>

                      <Typography>
                        Servicio disponible las 24 horas.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ========================================================= */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ========================================================= */}

      <Container maxWidth="lg" className="py-16">

        {/* ========================================================= */}
        {/* SERVICIOS DIGITALES */}
        {/* ========================================================= */}

        <Box mb={12}>

          <Typography
            variant="h4"
            align="center"
            fontWeight={800}
            mb={2}
          >
            Servicios Digitales
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            mb={6}
          >
            El Sistema Oficial de Gestión de Infracciones pone a disposición de los
            ciudadanos herramientas digitales para consultar y verificar información
            relacionada con el tránsito terrestre del Estado Táchira.
          </Typography>

          <Grid container spacing={4}>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ py: 5 }}>
                  <span className="material-symbols-outlined text-6xl text-tachira-yellow">
                    directions_car
                  </span>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                    mb={1}
                  >
                    Consulta por Placa
                  </Typography>

                  <Typography color="text.secondary">
                    Verifique las infracciones registradas de un vehículo mediante su placa.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ py: 5 }}>
                  <span className="material-symbols-outlined text-6xl text-tachira-yellow">
                    badge
                  </span>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                    mb={1}
                  >
                    Consulta por Cédula
                  </Typography>

                  <Typography color="text.secondary">
                    Consulte las infracciones asociadas a un conductor registrado.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ py: 5 }}>
                  <span className="material-symbols-outlined text-6xl text-tachira-yellow">
                    verified_user
                  </span>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                    mb={1}
                  >
                    Información Oficial
                  </Typography>

                  <Typography color="text.secondary">
                    Datos obtenidos directamente del sistema institucional de tránsito.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ py: 5 }}>
                  <span className="material-symbols-outlined text-6xl text-tachira-yellow">
                    schedule
                  </span>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                    mb={1}
                  >
                    Disponible 24/7
                  </Typography>

                  <Typography color="text.secondary">
                    Acceso permanente para consultas desde cualquier dispositivo.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>

        </Box>

        {/* ========================================================= */}
        {/* PROCESO DE CONSULTA (NUEVO) */}
        {/* ========================================================= */}

        <Box mb={14}>

          <Typography
            variant="h4"
            align="center"
            fontWeight={800}
            mb={2}
          >
            ¿Cómo realizar una consulta?
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            mb={8}
          >
            El proceso de consulta ha sido diseñado para ser rápido, seguro y accesible
            para todos los ciudadanos.
          </Typography>

          <Grid container spacing={4}>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: 2
                }}
              >
                <CardContent sx={{ p: 5 }}>

                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "#FFD54F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      mb: 3
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      1
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                  >
                    Ingrese sus datos
                  </Typography>

                  <Typography color="text.secondary">
                    Seleccione si desea consultar por número de cédula o por la placa
                    del vehículo.
                  </Typography>

                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: 2
                }}
              >
                <CardContent sx={{ p: 5 }}>

                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "#FFD54F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      mb: 3
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      2
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                  >
                    Validación automática
                  </Typography>

                  <Typography color="text.secondary">
                    El sistema consulta la base de datos institucional y verifica los
                    registros asociados.
                  </Typography>

                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: 2
                }}
              >
                <CardContent sx={{ p: 5 }}>

                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "#FFD54F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      mb: 3
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      3
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                  >
                    Consulte el resultado
                  </Typography>

                  <Typography color="text.secondary">
                    Visualice las infracciones registradas, el estado de cada una y la
                    información relacionada.
                  </Typography>

                </CardContent>
              </Card>
            </Grid>

          </Grid>

        </Box>

        {/* ========================================================= */}
        {/* PREGUNTAS FRECUENTES */}
        {/* ========================================================= */}

        <Box className="mt-20 max-w-3xl mx-auto">
          <Typography
            variant="h4"
            className="text-center font-extrabold text-tachira-black mb-10"
          >
            Preguntas Frecuentes
          </Typography>

          <Box className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                className="border border-gray-200 rounded-lg shadow-none before:hidden"
              >
                <AccordionSummary
                  expandIcon={
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  }
                >
                  <Typography className="font-bold">
                    {faq.q}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography className="text-gray-600">
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default HomePage;