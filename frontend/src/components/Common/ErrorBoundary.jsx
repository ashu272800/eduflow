import React, { Component } from 'react';
import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 12 }}>
          <Card variant="outlined" sx={{ borderStyle: 'dashed', textAlign: 'center', p: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Outfit' }}>
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                The application encountered an unexpected error. Don't worry, your data is safe.
              </Typography>
              {this.state.error && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    overflowX: 'auto',
                    mb: 3,
                    maxHeight: 150,
                  }}
                >
                  {this.state.error.toString()}
                </Box>
              )}
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{ mt: 1 }}
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
