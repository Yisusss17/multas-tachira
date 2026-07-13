import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function InfractionForm({ initialData, onSubmit, isEdit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    violation_description: '',
    ut_quantity: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        violation_description: initialData.violation_description || '',
        ut_quantity: initialData.ut_quantity || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.violation_description) newErrors.violation_description = 'La descripción es requerida';
    if (!formData.ut_quantity) newErrors.ut_quantity = 'La cantidad de UT es requerida';
    else if (isNaN(formData.ut_quantity) || Number(formData.ut_quantity) <= 0) {
        newErrors.ut_quantity = 'Debe ser un número mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
          ...formData,
          ut_quantity: Number(formData.ut_quantity)
      });
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Editar Tipo de Infracción' : 'Registrar Nuevo Tipo de Infracción'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción de la infracción"
              name="violation_description"
              value={formData.violation_description}
              onChange={handleChange}
              error={!!errors.violation_description}
              helperText={errors.violation_description}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cantidad de UT"
              name="ut_quantity"
              type="number"
              value={formData.ut_quantity}
              onChange={handleChange}
              error={!!errors.ut_quantity}
              helperText={errors.ut_quantity}
              inputProps={{ min: 0.01, step: 0.01 }}
            />
          </Grid>
        </Grid>
        
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate('/admin/infractions-catalog')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEdit ? 'Actualizar Infracción' : 'Guardar Infracción'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
