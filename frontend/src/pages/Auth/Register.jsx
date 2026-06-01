import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useToast } from '../../components/Common/Toast';

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'STAFF',
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await registerAuth(data.username, data.password, data.email, data.role);
      setSuccess('Registration completed successfully! Redirecting to login...');
      showToast('Account registered successfully', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Username or email might already be taken.');
      showToast('Registration failed', 'error');
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
        py: 4,
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
              Create Account
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" paragraph>
              Register your staff or faculty profile
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
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
                {...formRegister('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                slotProps={{
                  input: { sx: { borderRadius: 1.5 } }
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                margin="normal"
                {...formRegister('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: { sx: { borderRadius: 1.5 } }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                {...formRegister('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: { sx: { borderRadius: 1.5 } }
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                {...formRegister('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: { sx: { borderRadius: 1.5 } }
                }}
              />

              <TextField
                fullWidth
                select
                label="Select Role"
                variant="outlined"
                margin="normal"
                {...formRegister('role', { required: 'Role selection is required' })}
                error={!!errors.role}
                helperText={errors.role?.message}
                slotProps={{
                  select: { sx: { borderRadius: 1.5 } }
                }}
              >
                <MenuItem value="STAFF">STAFF (CRUD & View Records)</MenuItem>
                <MenuItem value="FACULTY">FACULTY (CRUD & Send Alerts)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (Full Access & Delete Privileges)</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAddIcon />}
                disabled={submitting}
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              >
                {submitting ? 'Creating Profile...' : 'Sign Up'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 600 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
