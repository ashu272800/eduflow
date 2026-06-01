import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import GppBadIcon from '@mui/icons-material/GppBad';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <GppBadIcon color="error" sx={{ fontSize: 80 }} />
        <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You do not have the required permissions to view this resource. If you believe this is a mistake, please contact your administrator.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};
