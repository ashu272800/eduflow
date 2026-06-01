import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HistoryIcon from '@mui/icons-material/History';
import { useForm } from 'react-hook-form';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Common/Toast';
import { LoadingScreen } from '../../components/Common/LoadingScreen';

export const Notifications = () => {
  const { user, hasRole } = useAuth();
  const { showToast } = useToast();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRecipient, setSearchRecipient] = useState('');

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      recipientId: '',
      message: '',
      type: 'EMAIL',
    }
  });

  const fetchHistory = async () => {
    if (!hasRole('ADMIN')) return;
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setHistory(data);
      setFilteredHistory(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to retrieve notification audit log history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Search Filter
  useEffect(() => {
    if (!searchRecipient) {
      setFilteredHistory(history);
      return;
    }
    const filtered = history.filter((h) =>
      h.recipientId.toString().includes(searchRecipient)
    );
    setFilteredHistory(filtered);
  }, [searchRecipient, history]);

  const onSubmit = async (data) => {
    try {
      await notificationService.send(
        parseInt(data.recipientId, 10),
        data.message,
        data.type
      );
      showToast('Notification queued successfully for dispatch', 'success');
      reset({
        recipientId: '',
        message: '',
        type: 'EMAIL',
      });
      // Refresh list after brief delay (to let async worker process if running)
      setTimeout(() => {
        fetchHistory();
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast('Failed to queue notification alert', 'error');
    }
  };

  if (loading && history.length === 0) {
    return <LoadingScreen message="Loading notifications audit record history..." />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
          Notification System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Queue, dispatch, and track automated alerts and announcements across email, SMS, and in-app channels.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Dispatch Form (ADMIN & FACULTY) */}
        <Grid item xs={12} md={hasRole('ADMIN') ? 5 : 12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsActiveIcon color="primary" /> Dispatch Notification
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create and queue a dynamic transactional alert for a student or staff member.
              </Typography>
              <Divider sx={{ my: 2 }} />

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={12}>
                    <TextField
                      fullWidth
                      label="Recipient User ID"
                      type="number"
                      placeholder="e.g. 1"
                      variant="outlined"
                      {...formRegister('recipientId', { required: 'Recipient ID is required' })}
                      error={!!errors.recipientId}
                      helperText={errors.recipientId?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={12}>
                    <TextField
                      fullWidth
                      select
                      label="Communication Channel"
                      variant="outlined"
                      {...formRegister('type', { required: 'Channel type is required' })}
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    >
                      <MenuItem value="EMAIL">EMAIL (SMTP Relay)</MenuItem>
                      <MenuItem value="SMS">SMS (Twilio Ready)</MenuItem>
                      <MenuItem value="IN_APP">IN-APP (WebSockets Alert)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Notification Message"
                      placeholder="Write your email/SMS notification alert body..."
                      variant="outlined"
                      {...formRegister('message', { required: 'Message body is required' })}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={<SendIcon />}
                      sx={{ py: 1.2, borderRadius: 1.5 }}
                    >
                      Queue Dispatch
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: History List (ADMIN Only) */}
        {hasRole('ADMIN') && (
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon color="primary" /> Dispatch History Log
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Filter by Recipient ID..."
                    value={searchRecipient}
                    onChange={(e) => setSearchRecipient(e.target.value)}
                    sx={{ width: 200 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Verify system delivery logs, channels, dispatch time metrics, and queue status.
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TableContainer sx={{ maxHeight: 420, overflowY: 'auto' }}>
                  <Table stickyHeader size="small" aria-label="notifications audit log">
                    <TableHead>
                      <TableRow>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Message Summary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              No dispatch log entries found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        [...filteredHistory].reverse().map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell>ID: {log.recipientId}</TableCell>
                            <TableCell>
                              <Chip label={log.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.message}>
                              {log.message}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.status}
                                size="small"
                                color={
                                  log.status === 'SENT'
                                    ? 'success'
                                    : log.status === 'FAILED'
                                    ? 'error'
                                    : 'warning'
                                }
                                sx={{ fontSize: '0.65rem', height: 18, fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {new Date(log.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default Notifications;
