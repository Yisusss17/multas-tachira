import { SvgColor } from "src/admin/components/svg-color";

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} />
);

const officerNavData = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: icon("ic-analytics"),
  },

  {
    title: "Levantar Multa",
    path: "/admin/infractions/new",
    icon: icon("ic-analytics"),
  },

  {
    title: "Mis Multas",
    path: "/admin/infractions/my",
    icon: icon("ic-analytics"),
  },

  {
    title: "Mi Perfil",
    path: "/admin/profile",
    icon: icon("ic-user"),
  },
];

export default officerNavData;