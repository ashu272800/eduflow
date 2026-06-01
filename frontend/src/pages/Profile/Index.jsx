import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Divider, Chip, Paper, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';
import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your account details, access levels, and security configurations.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left: Avatar Column */}
            <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3.5rem',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {user?.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2, fontFamily: 'Outfit', fontWeight: 700 }}>
                {user?.username}
              </Typography>
              <Chip
                label={user?.role}
                color={user?.role === 'ADMIN' ? 'error' : user?.role === 'FACULTY' ? 'primary' : 'default'}
                size="small"
                sx={{ fontWeight: 700, mt: 1, fontFamily: 'Outfit' }}
              />
            </Grid>

            {/* Right: Info Fields Column */}
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountCircleIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Username
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user?.username}
                    </Typography>
                  </Box>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user?.username === 'admin' ? 'admin@school.com' : `${user?.username.toLowerCase()}@school.com`}
                    </Typography>
                  </Box>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShieldIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Security Clearance Group
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user?.role === 'ADMIN'
                        ? 'Superuser Administrator (Full read/write/delete privileges)'
                        : user?.role === 'FACULTY'
                        ? 'Faculty Educator (Read/Write student rosters and course catalogs)'
                        : 'Support Staff (Read records & audit views)'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Security Best Practices Notice */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyIcon color="primary" /> Security Best Practices
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your account is secured with standard JWT (JSON Web Tokens) with a default expiration duration of 24 hours. Your password is encrypted in our PostgreSQL database using bcrypt hashing.
        </Typography>
        <Alert severity="info" icon={<InfoIcon fontSize="inherit" />}>
          To change your password or update your registration email, please contact the network administrator or invoke the backend custom `UserService` operations.
        </Alert>
      </Paper>
    </Box>
  );
};
export default Profile;
