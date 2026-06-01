import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            fontFamily: 'Outfit',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #3B82F6 30%, #10B981 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          EduFlow
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {user && (
            <div>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    sx: { mt: 1.5, minWidth: 160 }
                  }
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ gap: 1.5 }}>
                  <AccountCircleIcon fontSize="small" />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
