import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from 'src/admin/theme/theme-provider';
import { routesSection } from './routes/sections';
import 'src/admin/global.css';

export default function AdminRoutes() {
  const routes = useRoutes(routesSection);

  return (
    <ThemeProvider>
      {routes}
    </ThemeProvider>
  );
}
