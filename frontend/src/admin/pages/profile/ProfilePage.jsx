import React from 'react';
import { Box, Typography } from '@mui/material';
import { CONFIG } from 'src/admin/config-global';
import ProfileView from 'src/admin/sections/profile/view/ProfileView';

export default function ProfilePage() {
  return (
    <Box>
      <title>{`Mi Perfil - ${CONFIG.appName}`}</title>
      <ProfileView />
    </Box>
  );
}