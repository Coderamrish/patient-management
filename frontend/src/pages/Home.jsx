import { Box, Typography, Grid, Card, CardContent, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../context/AuthContext';

const tiles = [
  {
    label: 'Patients',
    icon: PeopleIcon,
    path: '/patients',
    desc: 'Register, edit and manage all patient records and medical history',
    color: '#1565C0',
    bg: '#E3F2FD',
    chip: 'Records',
  },
  {
    label: 'Doctors',
    icon: LocalHospitalIcon,
    path: '/doctors',
    desc: 'Manage doctors, specializations and availability schedules',
    color: '#00897B',
    bg: '#E0F2F1',
    chip: 'Staff',
  },
  {
    label: 'Appointments',
    icon: CalendarMonthIcon,
    path: '/appointments',
    desc: 'Book appointments, track status and manage scheduling',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    chip: 'Scheduling',
  },
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    desc: 'View analytics, stats and a complete system overview',
    color: '#EF6C00',
    bg: '#FFF3E0',
    chip: 'Analytics',
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
        px: { xs: 3, md: 6 }, py: { xs: 5, md: 7 },
        color: 'white',
      }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 52, height: 52, fontSize: 22, fontWeight: 700 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{greeting}</Typography>
              <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
            </Box>
          </Box>
          <Typography variant="h3" fontWeight={800} mt={2} sx={{ lineHeight: 1.2 }}>
            MediCare Admin Portal
          </Typography>
          <Typography sx={{ opacity: 0.75, mt: 1, fontSize: 16 }}>
            Patient Management System — manage records, staff and appointments from one place
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5, maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h6" fontWeight={600} mb={3} color="#1a1a2e">Quick Access</Typography>
        <Grid container spacing={3}>
          {tiles.map(({ label, icon: Icon, path, desc, color, bg, chip }) => (
            <Grid item xs={12} sm={6} key={path}>
              <Card
                elevation={0}
                onClick={() => navigate(path)}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid #e8ecf0',
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                    transform: 'translateY(-3px)',
                    borderColor: color,
                  },
                  '&:hover .arrow-icon': { opacity: 1, transform: 'translateX(0)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: bg }}>
                      <Icon sx={{ fontSize: 30, color }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={chip} size="small" sx={{ bgcolor: bg, color, fontWeight: 600, fontSize: 11 }} />
                      <ArrowForwardIcon
                        className="arrow-icon"
                        sx={{ fontSize: 18, color, opacity: 0, transform: 'translateX(-4px)', transition: '0.2s' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#1a1a2e" mb={0.5}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 5, p: 3, borderRadius: 3, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#DBEAFE' }}>
            <CalendarMonthIcon sx={{ color: '#1565C0', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#1565C0">Quick tip</Typography>
            <Typography variant="body2" color="#1E40AF">
              Start by adding doctors, then register patients, and book appointments from the Appointments page.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
