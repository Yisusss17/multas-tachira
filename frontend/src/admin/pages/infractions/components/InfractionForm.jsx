// frontend/src/admin/pages/infractions/components/InfractionForm.jsx (VERSIÓN CORREGIDA)
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Divider,
  InputAdornment,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const CONDICIONES = [
  { value: 'conductor', label: 'Conductor' },
  { value: 'peatón', label: 'Peatón' },
  { value: 'propietario', label: 'Propietario' },
  { value: 'conductor_propietario', label: 'Conductor y Propietario' }
];

const InfractionForm = ({
  boleta,
  fecha,
  setFecha,
  hora,
  setHora,
  lugar,
  setLugar,
  tiposMulta,
  tipoMulta,
  setTipoMulta,
  conductor,
  vehiculo,
  condicion,
  setCondicion,
  descripcionGeneral,
  setDescripcionGeneral,
  categorias,
  articulos,
  numerales,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  articuloSeleccionado,
  setArticuloSeleccionado,
  numeralSeleccionado,
  setNumeralSeleccionado,
  monto,
  onAgregarArticulo,
  onEnviarMulta,
  loading,
  disabled,
  articulosAcumulados = [],
  montoTotal = 0,
}) => {
  // Filtrar numerales por artículo seleccionado
  const numeralesFiltrados = numerales.filter(n => 
    !articuloSeleccionado || n.articul_prk === parseInt(articuloSeleccionado)
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Datos de la Multa
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Datos fijos de la multa */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número de Boleta"
              value={boleta}
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      receipt
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true }
              }}
              variant="outlined"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true }
              }}
              variant="outlined"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Tipo de Multa"
              value={tipoMulta}
              onChange={(e) => setTipoMulta(e.target.value)}
              variant="outlined"
              size="small"
              required
            >
              {tiposMulta.map((tipo) => (
                <MenuItem key={tipo.tipmult_prk} value={tipo.tipmult_prk}>
                  {tipo.tipmult_nom}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lugar de la Infracción"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              variant="outlined"
              size="small"
              required
              placeholder="Ej: Av. Principal con Calle 10, San Cristóbal"
            />
          </Grid>

          {/* Datos del infractor (solo lectura) */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Infractor"
              value={conductor ? `${conductor.nombre} ${conductor.apellido}` : ''}
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      person
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehículo"
              value={vehiculo ? `${vehiculo.vehicul_mrc} ${vehiculo.vehicul_mod} (${vehiculo.vehicul_pla})` : ''}
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      directions_car
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Condición del Infractor"
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              variant="outlined"
              size="small"
              required
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {CONDICIONES.map((opcion) => (
                <MenuItem key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={2}
              value={descripcionGeneral}
              onChange={(e) => setDescripcionGeneral(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Detalles adicionales sobre la infracción..."
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Sección de Artículos */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Agregar Artículo o Numeral
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Categoría"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.catego_prik} value={cat.catego_prik}>
                  {cat.catego_nomb}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Artículo"
              value={articuloSeleccionado}
              onChange={(e) => setArticuloSeleccionado(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {articulos.map((art) => (
                <MenuItem key={art.articul_prk} value={art.articul_prk}>
                  {art.articul_num} - {art.articul_des.substring(0, 40)}...
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Numeral"
              value={numeralSeleccionado}
              onChange={(e) => setNumeralSeleccionado(e.target.value)}
              variant="outlined"
              size="small"
              disabled={!articuloSeleccionado}
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {numeralesFiltrados.map((num) => (
                <MenuItem key={num.numeral_prk} value={num.numeral_prk}>
                  {num.articul_nrl} - {num.articul_des.substring(0, 30)}...
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monto (Bs)"
              type="number"
              value={monto}
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Bs</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAgregarArticulo}
              disabled={!categoriaSeleccionada || !articuloSeleccionado || !numeralSeleccionado || !monto}
              sx={{ mb: 2 }}
            >
              Agregar Artículo
            </Button>
          </Grid>
        </Grid>

        {/* Monto Total y Botón Enviar */}
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Artículos agregados: <strong>{articulosAcumulados?.length || 0}</strong>
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Total: Bs {montoTotal?.toFixed(2) || '0.00'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={onEnviarMulta}
            disabled={disabled || loading}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
              px: 4,
            }}
          >
            {loading ? 'Registrando...' : 'Registrar Multa'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfractionForm;