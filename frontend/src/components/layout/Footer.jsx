import React from 'react';
import { Box, Typography, Grid, Link, Container, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box className="bg-tachira-black text-gray-400 border-t border-gray-800 mt-auto">
      <Container maxWidth="lg">
        <Box className="py-12">
          <Grid container spacing={6}>
            {/* Institución */}
            <Grid item xs={12} md={5}>
              <Box className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-tachira-yellow text-3xl">
                  account_balance
                </span>

                <Box>
                  <Typography
                    variant="h6"
                    className="font-bold tracking-wide text-white"
                  >
                    Ges<span className="text-tachira-yellow">Multa</span>
                  </Typography>

                  <Typography
                    variant="caption"
                    className="text-gray-500 uppercase tracking-wider"
                  >
                    Sistema Oficial de Gestión de Infracciones
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                className="text-gray-400 leading-relaxed"
              >
                Plataforma oficial destinada al registro, consulta y
                administración de infracciones de tránsito terrestre del Estado
                Táchira, desarrollada para facilitar el acceso de ciudadanos y
                funcionarios a la información del sistema.
              </Typography>
            </Grid>

            {/* Servicios */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle2"
                className="text-white font-bold uppercase tracking-wider mb-4"
              >
                Servicios
              </Typography>

              <Box className="flex flex-col gap-3">
                <Link
                  href="/"
                  underline="none"
                  color="inherit"
                  className="hover:text-white"
                >
                  Inicio
                </Link>

                <Link
                  href="/consulta"
                  underline="none"
                  color="inherit"
                  className="hover:text-white"
                >
                  Consulta Ciudadana
                </Link>

                <Link
                  href="/reglamento"
                  underline="none"
                  color="inherit"
                  className="hover:text-white"
                >
                  Reglamento de Tránsito
                </Link>

                <Link
                  href="/login"
                  underline="none"
                  color="inherit"
                  className="hover:text-white"
                >
                  Acceso para Funcionarios
                </Link>
              </Box>
            </Grid>

            {/* Información Institucional */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                className="text-white font-bold uppercase tracking-wider mb-4"
              >
                Información Institucional
              </Typography>

              <Box className="flex flex-col gap-3 text-sm">
                <Box className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tachira-yellow text-lg">
                    location_on
                  </span>

                  <Typography variant="body2" className="text-gray-400">
                    Dirección de Tránsito Terrestre del Estado Táchira
                  </Typography>
                </Box>

                <Box className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tachira-yellow text-lg">
                    schedule
                  </span>

                  <Typography variant="body2" className="text-gray-400">
                    Atención administrativa en horario oficial.
                  </Typography>
                </Box>

                <Box className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tachira-yellow text-lg">
                    verified_user
                  </span>

                  <Typography variant="body2" className="text-gray-400">
                    Plataforma de uso institucional y consulta ciudadana.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider className="border-gray-800" />

        {/* Barra inferior */}
        <Box className="py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <Typography variant="caption" className="text-gray-500 text-center">
            © {new Date().getFullYear()} Gobierno del Estado Táchira · Sistema
            GesMulta · Todos los derechos reservados.
          </Typography>

          <Typography variant="caption" className="text-gray-600 text-center">
            Versión 1.0 · Plataforma Institucional
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;