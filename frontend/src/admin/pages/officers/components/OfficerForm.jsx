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
import { getUsers } from 'src/admin/api/officers';
import { useNavigate } from 'react-router-dom';

export default function OfficerForm({ initialData, onSubmit, isEdit }) {
  const navigate = useNavigate();
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    badge_code: '',
    id_user: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge_code: initialData.badge_code || '',
        id_user: initialData.id_user || '',
        status: initialData.status || 'Active'
      });
    }
    fetchUsers();
  }, [initialData]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.message || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.badge_code) newErrors.badge_code = 'El código de placa es requerido';
    if (!formData.id_user) newErrors.id_user = 'El usuario es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Create a payload, id_user must be an integer
      const payload = { ...formData, id_user: parseInt(formData.id_user, 10) };
      onSubmit(payload);
    }
  };

  if (loadingUsers) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Editar Funcionario' : 'Registrar Nuevo Funcionario'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código de Placa"
              name="badge_code"
              value={formData.badge_code}
              onChange={handleChange}
              error={!!errors.badge_code}
              helperText={errors.badge_code}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Usuario Asociado"
              name="id_user"
              select
              value={formData.id_user}
              onChange={handleChange}
              error={!!errors.id_user}
              helperText={errors.id_user}
              disabled={isEdit} // You shouldn't typically change the user associated to an officer once created
            >
              {users.map((user) => (
                <MenuItem key={user.id_user} value={user.id_user}>
                  {user.first_name} {user.last_name} ({user.identification})
                </MenuItem>
              ))}
            </TextField>
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
        </Grid>
        
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate('/admin/officers')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEdit ? 'Actualizar Funcionario' : 'Guardar Funcionario'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
