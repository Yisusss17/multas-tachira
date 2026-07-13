import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ConsultaPage from './pages/ConsultaPage';
import ResultadosPage from './pages/ResultadosPage';
import LoginPage from './pages/LoginPage';
import ReglamentoPage from './pages/ReglamentoPage';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="consulta" element={<ConsultaPage />} />
              <Route path="resultados" element={<ResultadosPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="reglamento" element={<ReglamentoPage />} />
            </Route>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
