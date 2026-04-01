import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Avatar, LinearProgress, Stack, Divider, IconButton, Tooltip,
  Paper, Fade, Grow, Zoom, useTheme, alpha, keyframes,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import api from '../api/axios';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const statusColors = { Scheduled: 'primary', Completed: 'success', Cancelled: 'error' };
const statusBg = { Scheduled: '#EFF6FF', Completed: '#ECFDF5', Cancelled: '#FEF2F2' };
const statusFg = { Scheduled: '#1D4ED8', Completed: '#065F46', Cancelled: '#991B1B' };
const statusIcons = { Scheduled: AccessTimeIcon, Completed: CheckCircleIcon, Cancelled: CancelIcon };

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, d, a] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/appointments')
      ]);
      setPatients(p.data);
      setDoctors(d.data);
      setAppointments(a.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const completionRate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;

  // Weekly trend mock data (could be replaced with real data)
  const weeklyTrend = [12, 19, 15, 22, 18, 25, 23];
  const maxTrend = Math.max(...weeklyTrend);

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: PeopleIcon,
      color: '#0A6EBD',
      gradient: 'linear-gradient(135deg, #0A6EBD 0%, #0891B2 100%)',
      bg: 'linear-gradient(135deg, rgba(10,110,189,0.08) 0%, rgba(8,145,178,0.08) 100%)',
      trend: '+12%',
      trendUp: true,
      description: 'Active patients in system',
    },
    {
      label: 'Active Doctors',
      value: doctors.length,
      icon: LocalHospitalIcon,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
      bg: 'linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(13,148,136,0.08) 100%)',
      trend: '+2',
      trendUp: true,
      description: 'Medical professionals',
    },
    {
      label: 'Total Appointments',
      value: appointments.length,
      icon: CalendarMonthIcon,
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      bg: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(109,40,217,0.08) 100%)',
      trend: '+28%',
      trendUp: true,
      description: 'All time appointments',
    },
    {
      label: 'Scheduled',
      value: scheduled,
      icon: CheckCircleIcon,
      color: '#DC6803',
      gradient: 'linear-gradient(135deg, #DC6803 0%, #D97706 100%)',
      bg: 'linear-gradient(135deg, rgba(220,104,3,0.08) 0%, rgba(217,119,6,0.08) 100%)',
      trend: 'Upcoming',
      trendUp: true,
      description: 'Pending appointments',
    },
  ];

  if (loading) return (
    <Box sx={{ 
      p: 6, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFE 0%, #F0F4F8 100%)',
    }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #0A6EBD 0%, #0891B2 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}>
          <LocalHospitalIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="#0C1F3F" mt={3}>
          Loading Dashboard
        </Typography>
        <Typography variant="body2" color="#64748B" mt={1}>
          Fetching your healthcare analytics...
        </Typography>
      </Box>
      <LinearProgress 
        sx={{ 
          width: 280, 
          borderRadius: 4, 
          height: 6, 
          bgcolor: '#E2E8F0', 
          '& .MuiLinearProgress-bar': { 
            bgcolor: '#0A6EBD', 
            borderRadius: 4,
            background: 'linear-gradient(90deg, #0A6EBD 0%, #0891B2 100%)',
          } 
        }} 
      />
    </Box>
  );

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #F8FAFE 0%, #F0F4F8 100%)', 
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      
      {/* Animated Background Elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ position: 'absolute', top: '15%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,110,189,0.03) 0%, transparent 70%)', animation: `${float} 20s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '0%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)', animation: `${float} 25s ease-in-out infinite reverse` }} />
      </Box>

      <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* Enhanced Page Header */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, background: 'linear-gradient(135deg, #0A6EBD 0%, #0891B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TimelineIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="overline" sx={{ color: '#0A6EBD', fontWeight: 800, letterSpacing: 2, fontSize: 12 }}>
                  ANALYTICS DASHBOARD
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={800} color="#0C1F3F" mt={0.5} sx={{ fontSize: { xs: 28, md: 38 } }}>
                Welcome Back!
              </Typography>
              <Typography color="#64748B" variant="body1" mt={1}>
                Here's what's happening with your healthcare system today
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={fetchData}
                  sx={{ 
                    bgcolor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: 2.5,
                    '&:hover': { bgcolor: '#F8FAFC', transform: 'rotate(180deg)' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <RefreshIcon sx={{ color: '#64748B' }} />
                </IconButton>
              </Tooltip>
              <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2.5, bgcolor: 'white', border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="#64748B">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Fade>

        {/* Enhanced Stat Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grow in timeout={600 + (index * 100)} key={stat.label}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(stat.color, 0.15)}`,
                      borderColor: alpha(stat.color, 0.3),
                    },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: stat.gradient,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          background: stat.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 3,
                            background: stat.gradient,
                            opacity: 0.1,
                          },
                        }}
                      >
                        <stat.icon sx={{ fontSize: 28, color: stat.color, position: 'relative', zIndex: 1 }} />
                      </Box>
                      <Chip
                        icon={stat.trendUp ? <ArrowUpwardIcon sx={{ fontSize: 12 }} /> : <ArrowDownwardIcon sx={{ fontSize: 12 }} />}
                        label={stat.trend}
                        size="small"
                        sx={{
                          bgcolor: alpha(stat.trendUp ? '#16A34A' : '#DC2626', 0.1),
                          color: stat.trendUp ? '#16A34A' : '#DC2626',
                          fontWeight: 700,
                          fontSize: 11,
                          height: 26,
                        }}
                      />
                    </Box>
                    <Typography variant="h2" fontWeight={800} color="#0C1F3F" sx={{ fontSize: { xs: 32, md: 40 }, lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="#64748B" mt={1} fontWeight={600}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" color="#94A3B8" mt={0.5} display="block">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>

        {/* Middle Row - Enhanced Analytics */}
        <Grid container spacing={3} mb={3}>
          {/* Enhanced Completion Card */}
          <Grid item xs={12} md={5}>
            <Zoom in timeout={800}>
              <Card elevation={0} sx={{ 
                borderRadius: 4, 
                border: '1px solid #E2E8F0', 
                bgcolor: 'white', 
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(10,110,189,0.03) 0%, transparent 70%)',
                  pointerEvents: 'none',
                },
              }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0C1F3F">
                        Appointment Analytics
                      </Typography>
                      <Typography variant="body2" color="#94A3B8">
                        Completion rate overview
                      </Typography>
                    </Box>
                    <PieChartIcon sx={{ color: '#0A6EBD', fontSize: 28, opacity: 0.6 }} />
                  </Box>

                  {/* Enhanced Circular Progress */}
                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Box sx={{ position: 'relative', width: 160, height: 160 }}>
                      <svg viewBox="0 0 160 160" width="160" height="160">
                        <circle cx="80" cy="80" r="68" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                        <circle
                          cx="80" cy="80" r="68" fill="none" stroke="url(#gradient)" strokeWidth="12"
                          strokeDasharray={`${completionRate * 4.27} 428`}
                          strokeLinecap="round"
                          transform="rotate(-90 80 80)"
                          style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0A6EBD" />
                            <stop offset="100%" stopColor="#0891B2" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h3" fontWeight={800} color="#0C1F3F">{completionRate}%</Typography>
                        <Typography variant="caption" color="#94A3B8" fontWeight={500}>Completion Rate</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Stack spacing={2}>
                    {[
                      { label: 'Completed', value: completed, color: '#059669', bg: '#ECFDF5', icon: CheckCircleIcon },
                      { label: 'Scheduled', value: scheduled, color: '#0A6EBD', bg: '#EFF6FF', icon: AccessTimeIcon },
                      { label: 'Cancelled', value: cancelled, color: '#DC2626', bg: '#FEF2F2', icon: CancelIcon },
                    ].map(({ label, value, color, bg, icon: Icon }) => (
                      <Box key={label} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        p: 1.5, 
                        borderRadius: 3, 
                        bgcolor: bg,
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateX(5px)' },
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Icon sx={{ fontSize: 18, color }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color }}>{label}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={800} sx={{ color }}>{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Weekly Trend Chart */}
          <Grid item xs={12} md={7}>
            <Zoom in timeout={900}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: 'white', height: '100%' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0C1F3F">
                        Weekly Appointment Trends
                      </Typography>
                      <Typography variant="body2" color="#94A3B8">
                        Last 7 days activity
                      </Typography>
                    </Box>
                    <BarChartIcon sx={{ color: '#7C3AED', fontSize: 28, opacity: 0.6 }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 200, mb: 2 }}>
                    {weeklyTrend.map((value, index) => (
                      <Tooltip title={`${value} appointments`} key={index}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${(value / maxTrend) * 160}px`,
                              background: `linear-gradient(180deg, ${index === 5 ? '#0A6EBD' : '#0891B2'} 0%, ${index === 5 ? '#0891B2' : '#60C8FF'} 100%)`,
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': { transform: 'scaleY(1.05)' },
                              position: 'relative',
                              overflow: 'hidden',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: `${shimmer} 2s infinite`,
                                backgroundSize: '200% 100%',
                              },
                            }}
                          />
                          <Typography variant="caption" color="#64748B" fontWeight={600}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 2, borderRadius: 2.5, bgcolor: '#F8FAFE' }}>
                    <Typography variant="caption" color="#64748B" display="block" textAlign="center">
                      📈 Peak activity on Saturdays with {maxTrend} appointments
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Recent Patients - Enhanced */}
        <Fade in timeout={1000}>
          <Card elevation={0} sx={{ 
            borderRadius: 4, 
            border: '1px solid #E2E8F0', 
            bgcolor: 'white',
            mb: 3,
            overflow: 'hidden',
          }}>
            <Box sx={{ 
              px: 3.5, 
              py: 2.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #F1F5F9',
              background: 'linear-gradient(135deg, #FAFBFC 0%, #FFFFFF 100%)',
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="#0C1F3F">Recent Patients</Typography>
                <Typography variant="caption" color="#94A3B8">Latest registrations in the system</Typography>
              </Box>
              <Chip 
                icon={<PeopleIcon sx={{ fontSize: 14 }} />}
                label={`${patients.length} total`} 
                size="small" 
                sx={{ 
                  bgcolor: '#EFF6FF', 
                  color: '#0A6EBD', 
                  fontWeight: 700, 
                  fontSize: 11, 
                  border: '1px solid #BFDBFE',
                  '& .MuiChip-icon': { color: '#0A6EBD' },
                }} 
              />
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                  {['Patient', 'Age', 'Phone', 'Blood Group', 'Status'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 800, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.slice(0, 5).map((p, index) => (
                  <TableRow 
                    key={p._id} 
                    sx={{ 
                      '&:hover': { bgcolor: '#F8FAFC', cursor: 'pointer' }, 
                      '&:last-child td': { border: 0 },
                      transition: '0.2s ease',
                      animation: `fadeIn 0.3s ease-out ${index * 0.1}s`,
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ 
                          width: 38, 
                          height: 38, 
                          background: 'linear-gradient(135deg, #0A6EBD 0%, #0891B2 100%)',
                          fontSize: 14, 
                          fontWeight: 700 
                        }}>
                          {p.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#0C1F3F">{p.name}</Typography>
                          {p.email && <Typography variant="caption" color="#94A3B8">{p.email}</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#475569" fontWeight={500}>{p.age} yrs</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#64748B">{p.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={p.bloodGroup || 'N/A'} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#FFFBEB', 
                          color: '#B45309', 
                          fontWeight: 700, 
                          fontSize: 11, 
                          border: '1px solid #FDE68A',
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Active" 
                        size="small" 
                        sx={{ 
                          bgcolor: '#ECFDF5', 
                          color: '#059669', 
                          fontWeight: 600, 
                          fontSize: 10,
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography color="#94A3B8">No patients registered yet</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Fade>

        {/* Recent Appointments - Enhanced */}
        <Fade in timeout={1100}>
          <Card elevation={0} sx={{ 
            borderRadius: 4, 
            border: '1px solid #E2E8F0', 
            bgcolor: 'white',
            overflow: 'hidden',
          }}>
            <Box sx={{ 
              px: 3.5, 
              py: 2.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #F1F5F9',
              background: 'linear-gradient(135deg, #FAFBFC 0%, #FFFFFF 100%)',
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="#0C1F3F">Recent Appointments</Typography>
                <Typography variant="caption" color="#94A3B8">Latest scheduled visits and checkups</Typography>
              </Box>
              <Chip 
                icon={<CalendarMonthIcon sx={{ fontSize: 14 }} />}
                label={`${appointments.length} total`} 
                size="small" 
                sx={{ 
                  bgcolor: '#F5F3FF', 
                  color: '#7C3AED', 
                  fontWeight: 700, 
                  fontSize: 11, 
                  border: '1px solid #DDD6FE',
                }} 
              />
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                  {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 800, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.slice(0, 6).map((a, index) => {
                  const StatusIcon = statusIcons[a.status];
                  return (
                    <TableRow 
                      key={a._id} 
                      sx={{ 
                        '&:hover': { bgcolor: '#F8FAFC' }, 
                        '&:last-child td': { border: 0 },
                        transition: '0.2s ease',
                        animation: `fadeIn 0.3s ease-out ${index * 0.1}s`,
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ 
                            width: 34, 
                            height: 34, 
                            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                            fontSize: 12, 
                            fontWeight: 700 
                          }}>
                            {a.patient?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={700} color="#0C1F3F">{a.patient?.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#475569" fontWeight={500}>
                          Dr. {a.doctor?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#64748B">
                          {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={a.time} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#F1F5F9', 
                            color: '#475569', 
                            fontWeight: 600, 
                            fontSize: 10,
                            height: 22,
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#64748B" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.reason || 'Regular checkup'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<StatusIcon sx={{ fontSize: 12 }} />}
                          label={a.status}
                          size="small"
                          sx={{
                            bgcolor: statusBg[a.status],
                            color: statusFg[a.status],
                            fontWeight: 700,
                            fontSize: 11,
                            border: `1px solid ${statusFg[a.status]}30`,
                            '& .MuiChip-icon': { fontSize: 12, color: statusFg[a.status] },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="#94A3B8">No appointments scheduled yet</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
}