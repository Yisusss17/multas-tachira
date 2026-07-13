import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/admin/components/iconify';

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }) {
  return (
    <IconButton sx={sx} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  );
}
