import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Avatar, Stack, Button, Paper, Fade, Zoom, Grow, LinearProgress, Divider, alpha, useTheme, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

const tiles = [
  {
    label: 'Patients',
    icon: PeopleIcon,
    path: '/patients',
    desc: 'Register, edit and manage all patient records and medical history',
    color: '#0A6EBD',
    gradientStart: '#0A6EBD',
    gradientEnd: '#0891B2',
    chip: 'Records',
    stat: 'Manage Records',
    stats: '+12 this week',
    trend: 'up',
    bgPattern: 'radial-gradient(circle at 100% 0%, rgba(10,110,189,0.05) 0%, transparent 50%)',
  },
  {
    label: 'Doctors',
    icon: LocalHospitalIcon,
    path: '/doctors',
    desc: 'Manage doctors, specializations and availability schedules',
    color: '#059669',
    gradientStart: '#059669',
    gradientEnd: '#0D9488',
    chip: 'Staff',
    stat: 'Manage Staff',
    stats: '+3 this month',
    trend: 'up',
    bgPattern: 'radial-gradient(circle at 0% 100%, rgba(5,150,105,0.05) 0%, transparent 50%)',
  },
  {
    label: 'Appointments',
    icon: CalendarMonthIcon,
    path: '/appointments',
    desc: 'Book appointments, track status and manage scheduling',
    color: '#7C3AED',
    gradientStart: '#7C3AED',
    gradientEnd: '#6D28D9',
    chip: 'Scheduling',
    stat: 'Book & Track',
    stats: '8 pending today',
    trend: 'neutral',
    bgPattern: 'radial-gradient(circle at 100% 100%, rgba(124,58,237,0.05) 0%, transparent 50%)',
  },
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    desc: 'View analytics, stats and a complete system overview',
    color: '#DC6803',
    gradientStart: '#DC6803',
    gradientEnd: '#D97706',
    chip: 'Analytics',
    stat: 'View Insights',
    stats: '+28% growth',
    trend: 'up',
    bgPattern: 'radial-gradient(circle at 0% 0%, rgba(220,104,3,0.05) 0%, transparent 50%)',
  },
];

const statsCards = [
  { label: 'Total Patients', icon: PeopleIcon, value: '0', change: '+12%', color: '#0A6EBD', delay: 0 },
  { label: 'Active Doctors', icon: LocalHospitalIcon, value: '0', change: '+5%', color: '#059669', delay: 0.1 },
  { label: "Today's Appointments", icon: TodayIcon, value: '0', change: '2 pending', color: '#7C3AED', delay: 0.2 },
  { label: 'Recovery Rate', icon: TrendingUpIcon, value: '94%', change: '+8%', color: '#DC6803', delay: 0.3 },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Fetch real data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/doctors'),
          api.get('/appointments')
        ]);
        setRealStats({
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: appointmentsRes.data.filter(a => {
            const today = new Date().toDateString();
            return new Date(a.date).toDateString() === today;
          }).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getGreetingEmoji = () => {
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
  };

  return (
    <Box sx={{ 
      bgcolor: '#F8FAFE', 
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Animated Background Elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,110,189,0.03) 0%, transparent 70%)', animation: `${float} 20s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', bottom: '20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)', animation: `${float} 25s ease-in-out infinite reverse` }} />
        <Box sx={{ position: 'absolute', top: '40%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.02) 0%, transparent 70%)', animation: `${float} 18s ease-in-out infinite` }} />
      </Box>

      {/* Hero Section with Glass Morphism */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0C1F3F 0%, #0A3761 50%, #0A6EBD 100%)',
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 1%)',
              backgroundSize: '50px 50px',
              animation: `${shine} 60s linear infinite`,
              pointerEvents: 'none',
            },
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,200,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,200,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative', zIndex: 2 }}>
            {/* User Greeting with Animation */}
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Zoom in timeout={600}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #60C8FF 0%, #0A6EBD 100%)',
                        width: 70,
                        height: 70,
                        fontSize: 28,
                        fontWeight: 800,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        border: '3px solid rgba(255,255,255,0.3)',
                        animation: `${pulse} 2s ease-in-out infinite`,
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Zoom>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }}>
                        {greeting}
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: 28 }}>
                        {getGreetingEmoji()}
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'white', lineHeight: 1.2, fontSize: { xs: 28, md: 36 } }}>
                      {user?.name}
                    </Typography>
                  </Box>
                </Box>
                <Paper elevation={0} sx={{ 
                  px: 2.5, 
                  py: 1.5, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CalendarMonthIcon sx={{ color: '#60C8FF', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {currentDate}
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            </Fade>

            {/* Main Title */}
            <Zoom in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2, px: 2, py: 0.5, borderRadius: 10, bgcolor: 'rgba(96,200,255,0.2)', backdropFilter: 'blur(5px)' }}>
                  <MedicalServicesIcon sx={{ color: '#60C8FF', fontSize: 18 }} />
                  <Typography sx={{ color: '#60C8FF', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                    Healthcare Management System
                  </Typography>
                </Box>
                <Typography variant="h2" fontWeight={800} sx={{ color: 'white', lineHeight: 1.2, fontSize: { xs: 32, md: 48 }, mb: 2 }}>
                  MediCare Portal
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 600, mx: 'auto' }}>
                  Patient Management System — manage records, staff and appointments from one unified platform
                </Typography>
              </Box>
            </Zoom>
          </Box>
        </Box>

        {/* Stats Overview Cards */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 8 }, mt: -4, mb: 6, position: 'relative', zIndex: 3 }}>
          <Grid container spacing={3}>
            {statsCards.map((stat, index) => (
              <Grow in timeout={800 + (stat.delay * 1000)} key={stat.label}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 20px 40px ${alpha(stat.color, 0.1)}`,
                        borderColor: alpha(stat.color, 0.3),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            background: alpha(stat.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <stat.icon sx={{ color: stat.color, fontSize: 26 }} />
                        </Box>
                        <Chip
                          label={stat.change}
                          size="small"
                          icon={stat.change.includes('+') ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            bgcolor: alpha(stat.color, 0.1),
                            color: stat.color,
                            fontWeight: 600,
                            fontSize: 11,
                            height: 24,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={800} sx={{ color: '#0C1F3F', mb: 0.5 }}>
                        {stat.label === 'Total Patients' ? realStats.patients : 
                         stat.label === 'Active Doctors' ? realStats.doctors :
                         stat.label === "Today's Appointments" ? realStats.appointments :
                         stat.value}
                      </Typography>
                      {loading && <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />}
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Box>

        {/* Quick Access Section */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 8 }, pb: 8 }}>
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: '#0A6EBD', fontWeight: 800, letterSpacing: 3, fontSize: 12 }}>
              NAVIGATION
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#0C1F3F" mt={1}>
              Quick Access Modules
            </Typography>
            <Typography variant="body2" color="#64748B" mt={1}>
              Select a module to start managing your healthcare operations
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {tiles.map((tile, index) => (
              <Grow in timeout={1200 + (index * 200)} key={tile.path}>
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    onClick={() => navigate(tile.path)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 5,
                      border: '1px solid rgba(0,0,0,0.05)',
                      bgcolor: 'white',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: tile.bgPattern,
                        pointerEvents: 'none',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 25px 45px -12px ${alpha(tile.color, 0.3)}`,
                        borderColor: alpha(tile.color, 0.3),
                      },
                      '&:hover .tile-accent': {
                        width: '100%',
                      },
                      '&:hover .arrow-icon': {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                      '&:hover .tile-icon': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Box
                      className="tile-accent"
                      sx={{
                        height: 5,
                        background: `linear-gradient(90deg, ${tile.gradientStart}, ${tile.gradientEnd})`,
                        width: '30%',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box
                          className="tile-icon"
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(tile.gradientStart, 0.1)} 0%, ${alpha(tile.gradientEnd, 0.2)} 100%)`,
                            border: `1px solid ${alpha(tile.color, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <tile.icon sx={{ fontSize: 32, color: tile.color }} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={tile.chip}
                            size="small"
                            sx={{
                              bgcolor: alpha(tile.color, 0.1),
                              color: tile.color,
                              fontWeight: 700,
                              fontSize: 11,
                              letterSpacing: 0.5,
                              height: 26,
                              border: `1px solid ${alpha(tile.color, 0.2)}`,
                            }}
                          />
                          <Box
                            className="arrow-icon"
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: alpha(tile.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transform: 'translateX(-8px)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <ArrowForwardIcon sx={{ fontSize: 18, color: tile.color }} />
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="h5" fontWeight={800} color="#0C1F3F" mb={1} fontSize={22}>
                        {tile.label}
                      </Typography>
                      <Typography variant="body2" color="#64748B" lineHeight={1.6} mb={2}>
                        {tile.desc}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ fontSize: 14, color: tile.color }} />
                        <Typography variant="caption" sx={{ color: tile.color, fontWeight: 600 }}>
                          {tile.stats}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>

          {/* Motivational Banner */}
          <Zoom in timeout={1600}>
            <Box
              sx={{
                mt: 6,
                p: 4,
                borderRadius: 5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                },
              }}
            >
              <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmojiEventsIcon sx={{ fontSize: 48, color: 'white', animation: `${pulse} 2s ease-in-out infinite` }} />
                    <Box>
                      <Typography variant="h6" fontWeight={800} sx={{ color: 'white', mb: 0.5 }}>
                        Excellence in Healthcare Management
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        You're making a difference in patient care. Keep up the great work! 🏥
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: 'white',
                      color: '#764ba2',
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View Dashboard Analytics
                    <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Zoom>

          {/* Quick Tip */}
          <Fade in timeout={1800}>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Divider sx={{ my: 3 }}>
                <Chip
                  icon={<MedicalServicesIcon />}
                  label="Pro Tip"
                  sx={{ bgcolor: alpha('#0A6EBD', 0.1), color: '#0A6EBD', fontWeight: 600 }}
                />
              </Divider>
              <Typography variant="body2" color="#64748B">
                💡 Start by adding doctors, then register patients, and book appointments from the Appointments page for seamless workflow
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}