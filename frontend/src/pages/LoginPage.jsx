import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert, Collapse, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();

        console.log(email);
        console.log(password);

      if (!email || !password) return;

      setLoading(true);
      setErrorMsg('');

      const result = await login(email, password);

      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMsg(result.error || 'Credenciales incorrectas o usuario inactivo');
        setLoading(false);
      }
};

  return (
    <Container maxWidth="xs" className="py-20 flex items-center justify-center fade-in">
      <Card className="w-full border border-gray-200 shadow-md">
        <CardContent className="p-8">
          {/* Form Header */}
          <Box className="text-center mb-8">
            <Box className="w-16 h-16 bg-tachira-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-tachira-yellowDark text-3xl font-extrabold">admin_panel_settings</span>
            </Box>
            <Typography variant="h4" className="font-extrabold text-tachira-black mb-2">
              Ingreso Oficiales
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Acceda al sistema de administración de multas y control vial.
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField
              fullWidth
              type="email"
              label="Correo electrónico"
              placeholder="correo@institucion.gob.ve"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                  startAdornment:(
                      <InputAdornment position="start">
                          <span className="material-symbols-outlined text-gray-400">
                              mail
                          </span>
            </InputAdornment>
        )
    }}
/>

            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="material-symbols-outlined text-gray-400">lock</span>
                  </InputAdornment>
                ),
              }}
            />

            <Collapse in={!!errorMsg}>
              <Alert severity="error" className="font-semibold text-xs py-0">
                {errorMsg}
              </Alert>
            </Collapse>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              className="bg-tachira-yellow hover:bg-tachira-yellowDark text-tachira-black font-extrabold py-3.5 mt-2"
              endIcon={loading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">arrow_forward</span>}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
