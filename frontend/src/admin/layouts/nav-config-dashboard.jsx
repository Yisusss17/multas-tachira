import { SvgColor } from 'src/admin/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export const navData = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Mis Multas',
    path: '/admin/infractions/my',
    icon: icon('ic-blog'),
  },
  {
    title: 'Levantar Multa',
    path: '/admin/infractions/new',
    icon: icon('ic-analytics'), // Maybe change icon later
  },
  {
    title: 'Gestión de Multas',
    path: '/admin/tickets',
    icon: icon('ic-cart'),
  },
  {
    title: 'Catálogo de Infracciones',
    path: '/admin/infractions-catalog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Usuarios',
    path: '/admin/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Funcionarios',
    path: '/admin/officers',
    icon: icon('ic-user'),
  },

  {
    title: 'Auditoría',
    path: '/admin/audit',
    icon: icon('ic-analytics'), // Puedes elegir el icono que prefieras (ej. 'ic-analytics', 'ic-user', etc.)
  },



  {
    title: 'Sign in',
    path: '/admin/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/admin/404',
    icon: icon('ic-disabled'),
  },




];
