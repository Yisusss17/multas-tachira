import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { getRoles } from 'src/admin/api/users';
import { useNavigate } from 'react-router-dom';

export default function UserForm({ initialData, onSubmit, isEdit }) {
  const navigate = useNavigate();
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    identification: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    id_rol: '',
    status: 'Active',
    badge_code: ''
  });
  const [errors, setErrors] = useState({});

  // Helper para saber si es oficial
  const isOfficerSelected = () => {
    const selectedRole = roles.find(r => r.id_rol === formData.id_rol);
    if (!selectedRole) return false;
    const name = selectedRole.name.toLowerCase();
    return name.includes('traffic') || name.includes('funcionario') || name.includes('oficial');
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        identification: initialData.identification || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        password: '', // Leave password empty for edit
       
        id_rol: initialData.id_rol || '',
        status: initialData.status || 'Active',
        badge_code: initialData.badge_code || ''
      });
    }
    fetchRoles();
  }, [initialData]);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data.message || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identification) newErrors.identification = 'La cédula es requerida';
    if (!formData.first_name) newErrors.first_name = 'El nombre es requerido';
    if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!isEdit && !formData.password) {
      newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.id_rol) newErrors.id_rol = 'El rol es requerido';
    
    if (isOfficerSelected() && !formData.badge_code) {
      newErrors.badge_code = 'El código de placa es requerido para este rol';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (loadingRoles) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cédula"
              name="identification"
              value={formData.identification}
              onChange={handleChange}
              error={!!errors.identification}
              helperText={errors.identification}
              disabled={isEdit} // Option: block cedula editing
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rol"
              name="id_rol"
              select
              value={formData.id_rol}
              onChange={handleChange}
              error={!!errors.id_rol}
              helperText={errors.id_rol}
            >
              {roles.map((role) => (
                <MenuItem key={role.id_rol} value={role.id_rol}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          
          
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={isEdit ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estado"
              name="status"
              select
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Active">Activo</MenuItem>
              <MenuItem value="Inactive">Inactivo</MenuItem>
            </TextField>
          </Grid>
          
          {isOfficerSelected() && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código de Placa (Badge Code)"
                name="badge_code"
                value={formData.badge_code}
                onChange={handleChange}
                error={!!errors.badge_code}
                helperText={errors.badge_code}
              />
            </Grid>
          )}
        </Grid>
        
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate('/admin/users')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEdit ? 'Actualizar Usuario' : 'Guardar Usuario'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
