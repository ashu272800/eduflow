import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

export const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Courses', icon: <BookIcon />, path: '/courses' },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/notifications',
      // Accessible by ADMIN (full history) and FACULTY (sending allowed)
      roles: ['ADMIN', 'FACULTY'],
    },
    { text: 'Profile', icon: <AccountBoxIcon />, path: '/profile' },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar />
      <Divider />
      {user && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Chip
            label={user.role}
            color={user.role === 'ADMIN' ? 'error' : user.role === 'FACULTY' ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 700, mt: 1, fontFamily: 'Outfit' }}
          />
        </Box>
      )}
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          // Check role permission
          if (item.roles && !hasRole(item.roles)) {
            return null;
          }

          const isSelected =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) onDrawerToggle();
                }}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: isSelected ? 'primary.light' : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.light' : 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isSelected ? 'primary.contrastText' : 'text.secondary',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 600 : 500,
                    fontFamily: 'Outfit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
