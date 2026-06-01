import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ShieldIcon from '@mui/icons-material/Shield';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, Cell } from 'recharts';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../../components/Common/LoadingScreen';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studentsCount: 0,
    coursesCount: 0,
    notificationsCount: 0,
    role: '',
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fire requests in parallel
        const [students, courses] = await Promise.all([
          studentService.getAll().catch(() => []),
          courseService.getAll().catch(() => []),
        ]);

        let notifications = [];
        if (user && (user.role === 'ADMIN' || user.role === 'FACULTY')) {
          notifications = await notificationService.getAll().catch(() => []);
        }

        // Count states
        const activeCount = students.filter(s => s.status === 'ACTIVE').length;
        const inactiveCount = students.filter(s => s.status === 'INACTIVE').length;
        const graduatedCount = students.filter(s => s.status === 'GRADUATED').length;

        setStats({
          studentsCount: students.length,
          coursesCount: courses.length,
          notificationsCount: notifications.length,
          role: user?.role || 'STAFF',
        });

        setRecentStudents(students.slice(-5).reverse());
        setRecentCourses(courses.slice(-5).reverse());
        setRecentNotifications(notifications.slice(-4).reverse());

        setChartData([
          { name: 'Active', value: activeCount, color: '#10B981' },
          { name: 'Inactive', value: inactiveCount, color: '#64748B' },
          { name: 'Graduated', value: graduatedCount, color: '#3B82F6' },
        ]);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingScreen message="Aggregating workspace metrics..." />;
  }

  const statCards = [
    {
      title: 'Total Students Enrolled',
      value: stats.studentsCount,
      icon: <PeopleIcon sx={{ fontSize: 32, color: '#3B82F6' }} />,
      bgColor: 'rgba(59, 130, 246, 0.08)',
    },
    {
      title: 'Active Courses Offered',
      value: stats.coursesCount,
      icon: <BookIcon sx={{ fontSize: 32, color: '#10B981' }} />,
      bgColor: 'rgba(16, 185, 129, 0.08)',
    },
    {
      title: 'System Notifications Sent',
      value: stats.notificationsCount,
      icon: <NotificationsActiveIcon sx={{ fontSize: 32, color: '#F59E0B' }} />,
      bgColor: 'rgba(245, 158, 11, 0.08)',
    },
    {
      title: 'Your Security Clearance',
      value: stats.role,
      icon: <ShieldIcon sx={{ fontSize: 32, color: '#EF4444' }} />,
      bgColor: 'rgba(239, 68, 68, 0.08)',
      isText: true,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, <strong>{user?.username}</strong>. Here is the active status report of EduFlow operations.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, mt: 0.5 }}>
                    {card.isText ? card.value : card.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: card.bgColor, width: 56, height: 56 }}>
                  {card.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Visual Analytics & Recent Actions */}
      <Grid container spacing={3}>
        {/* Charts Panel */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 700, mb: 3 }}>
              Student Status Demographics
            </Typography>
            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                  <ChartTooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Notifications Panel */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 700, mb: 2 }}>
              Recent Notification Dispatches
            </Typography>
            {recentNotifications.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No notification logs recorded</Typography>
              </Box>
            ) : (
              <List>
                {recentNotifications.map((notif, index) => (
                  <React.Fragment key={notif.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notif.type === 'EMAIL' ? 'primary.light' : 'secondary.light', color: 'white' }}>
                          <NotificationsActiveIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Recipient ID: {notif.recipientId}
                            </Typography>
                            <Chip
                              label={notif.type}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 18 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.primary" noWrap>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Sent At: {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentNotifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
