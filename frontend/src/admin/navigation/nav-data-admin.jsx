import { SvgColor } from "src/admin/components/svg-color";

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} />
);

const adminNavData = [

  {
    title: "Dashboard",
    path: "/admin",
    icon: icon("ic-analytics"),
  },

  {
    title: "Usuarios",
    path: "/admin/users",
    icon: icon("ic-user"),
  },

  {
    title: "Conductores",
    path: "/admin/drivers",
    icon: icon("ic-user"),
  },

  {
    title: "Vehículos",
    path: "/admin/vehicles",
    icon: icon("ic-cart"),
  },

  {
    title: "Tipos de Vehículos",
    path: "/admin/vehicle-types",
    icon: icon("ic-cart"),
  },

  {
    title: "Infracciones",
    path: "/admin/infractions-catalog",
    icon: icon("ic-blog"),
  },

  {
    title: "Condiciones",
    path: "/admin/offender-conditions",
    icon: icon("ic-blog"),
  },

  {
    title: "Multas",
    path: "/admin/tickets",
    icon: icon("ic-analytics"),
  },

  {
    title: "Configuración",
    path: "/admin/settings",
    icon: icon("ic-lock"),
  },

{
  title: "Auditoría del Sistema",
  path: "/admin/audit",
  icon: icon("ic-blog"),
},



  {
    title: "Mi Perfil",
    path: "/admin/profile",
    icon: icon("ic-user"),
  },






];

export default adminNavData;