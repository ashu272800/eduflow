import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingScreen = ({ message = 'Loading EduFlow...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 2,
      }}
    >
      <CircularProgress size={48} thickness={4.5} color="primary" />
      <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Outfit', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};
