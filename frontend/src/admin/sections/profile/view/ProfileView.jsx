import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { useAuth } from 'src/context/AuthContext';
import api from 'src/api/axios';

export default function ProfileView() {
  const { user } = useAuth();
  console.log("Usuario autenticado:", user); // Solo lectura, sin setUser
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Datos del perfil (solo para mostrar)
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    identification: '',
    role_name: '',
    status: '',
    badge_code: '',
  });

  // Datos para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Cargar datos del perfil desde el usuario autenticado
  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        identification: user.identification || '',
        role_name: user.role_name || user.role || '',
        status: user.status || '',
        badge_code: user.badge_code || '',
      });
    }
  }, [user]);

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingPassword(true);

    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSavingPassword(false);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setSavingPassword(false);
      return;
    }

    try {
      const payload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      const response = await api.put('/password/change', payload);
      if (response.data.status === 200) {
        setSuccess('Contraseña cambiada correctamente');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(response.data.message || 'Error al cambiar contraseña');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error de conexión');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" py={4}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Mi Perfil
      </Typography>

      {/* ========================================================= */}
      {/* ENCABEZADO DEL PERFIL */}
      {/* ========================================================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: 'primary.main',
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              {profile.first_name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h5" fontWeight={700}>
                {profile.first_name} {profile.last_name}
              </Typography>

              <Typography color="text.secondary">
                {profile.role_name}
              </Typography>

              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                <Chip
                  label={profile.status}
                  color={profile.status === 'Active' ? 'success' : 'error'}
                />

                {profile.badge_code && (
                  <Chip
                    label={`Placa ${profile.badge_code}`}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* ========================================================= */}
      {/* TARJETA DE DATOS PERSONALES (SOLO LECTURA) */}
      {/* ========================================================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Datos Personales
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={profile.first_name}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={profile.last_name}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                value={profile.email}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cédula"
                value={profile.identification}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rol"
                value={profile.role_name}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estado"
                value={profile.status}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* ========================================================= */}
      {/* TARJETA DE CAMBIO DE CONTRASEÑA */}
      {/* ========================================================= */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Cambiar Contraseña
          </Typography>
          <Grid container spacing={3} component="form" onSubmit={handleChangePassword}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña Actual"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={savingPassword}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={savingPassword}
                size="small"
                required
                helperText="Mínimo 6 caracteres"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={savingPassword}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={savingPassword}
                sx={{ bgcolor: '#D4A017', color: '#111827', '&:hover': { bgcolor: '#B8860B' } }}
              >
                {savingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}