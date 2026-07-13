import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/admin/layouts/auth';
import { DashboardLayout } from 'src/admin/layouts/dashboard';
import { useAuth } from 'src/context/AuthContext';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/admin/pages/dashboard'));
export const BlogPage = lazy(() => import('src/admin/pages/blog'));
export const UserPage = lazy(() => import('src/admin/pages/user'));
export const SignInPage = lazy(() => import('src/admin/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/admin/pages/products'));
export const Page404 = lazy(() => import('src/admin/pages/page-not-found'));

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
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth() as any;
  if (loading) return renderFallback();
  if (!isAuthenticated) return <Navigate to="/admin/sign-in" replace />;
  return <>{children}</>;
};

export const routesSection: RouteObject[] = [
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
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
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
