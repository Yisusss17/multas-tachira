import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box className="flex flex-col min-h-screen">
      <Navbar />
      <Box component="main" className="flex-grow pt-16 pb-12">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
