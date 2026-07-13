import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/admin/layouts/auth';
import { DashboardLayout } from 'src/admin/layouts/dashboard';
import { useAuth } from 'src/context/AuthContext';
import ProfilePage from '../pages/profile/ProfilePage';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/admin/pages/dashboard'));
export const BlogPage = lazy(() => import('src/admin/pages/blog'));
export const UserPage = lazy(() => import('src/admin/pages/user'));
export const SignInPage = lazy(() => import('src/admin/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/admin/pages/products'));
export const Page404 = lazy(() => import('src/admin/pages/page-not-found'));

// ============================================
// NUEVOS IMPORTS PARA EL MÓDULO DE INFRACCIONES
// ============================================
export const CreateInfraction = lazy(() => import('src/admin/pages/infractions/CreateInfraction'));
export const MyInfractions = lazy(() => import('src/admin/pages/infractions/MyInfractions'));
export const ReviewInfractions = lazy(() => import('src/admin/pages/infractions/ReviewInfractions'));
export const InfractionDetails = lazy(() => import('src/admin/pages/infractions/InfractionDetails'));
export const EditOfficerInfraction = lazy(() => import('src/admin/pages/infractions/EditInfraction'));


export const UsersPage = lazy(() => import("src/admin/pages/users/Users"));
export const RegisterUserPage = lazy(() => import("src/admin/pages/users/RegisterUser"));
export const EditUserPage = lazy(() => import("src/admin/pages/users/EditUser"));

export const OfficersPage = lazy(() => import("src/admin/pages/officers/Officers"));
export const RegisterOfficerPage = lazy(() => import("src/admin/pages/officers/RegisterOfficer"));
export const EditOfficerPage = lazy(() => import("src/admin/pages/officers/EditOfficer"));

export const InfractionsCatalogPage = lazy(() => import("src/admin/pages/infractions-catalog/InfractionsCatalog"));
export const RegisterInfractionPage = lazy(() => import("src/admin/pages/infractions-catalog/RegisterInfraction"));
export const EditInfractionPage = lazy(() => import("src/admin/pages/infractions-catalog/EditInfraction"));

export const TicketsPage = lazy(() => import("src/admin/pages/tickets/Tickets"));

export const AuditLogsPage = lazy(() => import("src/admin/pages/audit/AuditLogs"));


// ============================================
// COMPONENTE DE CARGA
// ============================================
const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// ============================================
// COMPONENTE DE RUTA PROTEGIDA
// ============================================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return renderFallback();
  if (!isAuthenticated) return <Navigate to="/admin/sign-in" replace />;
  return <>{children}</>;
};

// ============================================
// CONFIGURACIÓN DE RUTAS
// ============================================
export const routesSection = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      // Dashboard
      { index: true, element: <DashboardPage /> },


        { path: "users", element: <UsersPage /> },
        { path: "users/register", element: <RegisterUserPage /> },
        { path: "users/edit/:id", element: <EditUserPage /> },

        { path: "officers", element: <OfficersPage /> },
        { path: "officers/register", element: <RegisterOfficerPage /> },
        { path: "officers/edit/:id", element: <EditOfficerPage /> },

        { path: "infractions-catalog", element: <InfractionsCatalogPage /> },
        { path: "infractions-catalog/register", element: <RegisterInfractionPage /> },
        { path: "infractions-catalog/edit/:id", element: <EditInfractionPage /> },

        { path: "tickets", element: <TicketsPage /> },

        // ============================================
        // MI PERFIL (NUEVO)
        // ============================================
        { path: "profile", element: <ProfilePage /> },

        { path: "audit", element: <AuditLogsPage /> },

      
      // ============================================
      // MÓDULO DE INFRACCIONES (NUEVO)
      // ============================================
      { path: 'infractions/new', element: <CreateInfraction /> },
      { path: 'infractions/my', element: <MyInfractions /> },
      { path: 'infractions/review', element: <ReviewInfractions /> },

// Nueva ruta de edición
      { path: 'infractions/edit/:id', element: <EditOfficerInfraction /> },

// Detalle de la multa
      { path: 'infractions/:id', element: <InfractionDetails /> },
      // ============================================
      // MÓDULOS EXISTENTES
      // ============================================
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },

  
  
  // ============================================
  // RUTAS PÚBLICAS / AUTENTICACIÓN
  // ============================================
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];