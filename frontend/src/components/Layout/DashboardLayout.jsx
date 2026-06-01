import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onDrawerToggle={handleDrawerToggle} />
      
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - 240px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, mt: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default DashboardLayout;
