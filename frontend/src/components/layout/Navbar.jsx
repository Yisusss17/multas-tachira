import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Consulta Ciudadana', path: '/consulta' },
    { label: 'Normativa', path: '/reglamento' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className="bg-white border-b border-gray-200"
      >
        <Toolbar className="max-w-7xl w-full mx-auto px-4 md:px-8 flex justify-between h-20">
          {/* Logo Branding */}
          <Box
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Box className="w-12 h-12 rounded-full bg-tachira-yellow flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-black text-3xl">
                shield
              </span>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                className="text-black font-bold leading-none"
              >
                Sistema Integrado de Gestión
              </Typography>

              <Typography
                variant="caption"
                className="text-gray-500 tracking-wide"
              >
                Gobierno del Estado Táchira
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#111827',
                    fontWeight: 600,
                    '&:hover': {
                      color: '#D4A017',
                    },
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    ...(isActive(link.path) && {
                      color: '#D4A017',
                      borderBottom: '3px solid #D4A017',
                      borderRadius: 0,
                    }),
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          {!isMobile ? (
            <Box className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Box className="flex items-center gap-1.5 text-gray-600 text-xs font-semibold bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-tachira-yellowDark text-sm">account_circle</span>
                    <span>{user?.role || 'Oficial'}</span>
                  </Box>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      color: '#111827',
                      borderColor: '#111827',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#111827',
                        color: '#fff',
                        borderColor: '#111827',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        transform: 'scale(1.02)',
                      },
                    }}
                    size="small"
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    backgroundColor: '#D4A017',
                    color: '#111827',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#A0760A', // Fondo más oscuro para que resalte aún más
                      boxShadow: '0 4px 14px rgba(212, 160, 23, 0.5)', // Sombra fuerte y dorada
                      transform: 'scale(1.02)',
                    },
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    px: 3,
                    py: 1,
                  }}
                  startIcon={<span className="material-symbols-outlined text-sm">login</span>}
                >
                  Acceso Administrativo
                </Button>
              )}
            </Box>
          ) : (
            /* Mobile Hamburguer Button */
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#111827' }}
            >
              <span className="material-symbols-outlined">menu</span>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          className="w-64 h-full bg-tachira-black text-white p-6 flex flex-col justify-between"
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <Box>
            <Box className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-tachira-yellow text-3xl font-bold">shield</span>
              <Typography variant="h6" className="font-bold tracking-wider">
                Ges<span className="text-tachira-yellow">Multa</span>
              </Typography>
            </Box>
            <List className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <ListItem
                  button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  className={`rounded p-3 ${
                    isActive(link.path)
                      ? 'bg-tachira-yellow/10 text-tachira-yellow font-bold'
                      : 'text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box className="mt-auto border-t border-gray-800 pt-6">
            {isAuthenticated ? (
              <Box className="flex flex-col gap-3">
                <Typography variant="caption" className="text-gray-400 block font-semibold">
                  Rol: {user?.role || 'Oficial'}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  fullWidth
                  className="border-tachira-yellow text-tachira-yellow hover:bg-tachira-yellow/10"
                >
                  Cerrar Sesión
                </Button>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#D4A017',
                  color: '#111827',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: '#B8860B',
                  },
                }}
                startIcon={<span className="material-symbols-outlined">login</span>}
              >
                Ingreso Oficiales
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;