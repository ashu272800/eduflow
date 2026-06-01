import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, InputAdornment, IconButton, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useToast } from '../../components/Common/Toast';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      await login(data.username, data.password);
      showToast('Welcome to EduFlow!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid username or password. Please try again.');
      showToast('Authentication failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 800,
              background: 'linear-gradient(45deg, #3B82F6 30%, #10B981 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EduFlow
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Advanced Education Workflow Automation
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
              Sign In
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" paragraph>
              Access your workspace portal
            </Typography>

            {location.search.includes('expired=true') && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your session has expired. Please sign in again.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                {...formRegister('username', { required: 'Username is required' })}
                error={!!errors.username}
                helperText={errors.username?.message}
                slotProps={{
                  input: {
                    sx: { borderRadius: 1.5 }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                {...formRegister('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 1.5 }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<LockOpenIcon />}
                disabled={submitting}
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              >
                {submitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 600 }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
