import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BRAND = '#0057FF';
const ACCENT = '#00C896';
const WARM = '#FF6B35';
const INK = '#0A0E1A';

const modules = [
  { label: 'Patients', icon: PeopleIcon, path: '/patients', desc: 'Register, manage and track all patient records, histories and medical data with full CRUD operations.', color: BRAND, bg: '#EEF4FF', number: '01', tag: 'RECORDS' },
  { label: 'Doctors', icon: LocalHospitalIcon, path: '/doctors', desc: 'Manage medical staff, specializations, schedules and availability across all departments.', color: ACCENT, bg: '#EDFAF5', number: '02', tag: 'STAFF' },
  { label: 'Appointments', icon: CalendarMonthIcon, path: '/appointments', desc: 'Book, track and manage all patient appointments, statuses and scheduling workflows.', color: WARM, bg: '#FFF3EE', number: '03', tag: 'SCHEDULE' },
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard', desc: 'Real-time analytics, statistics and a complete operational overview of the entire system.', color: '#7C3AED', bg: '#F5F0FF', number: '04', tag: 'ANALYTICS' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')])
      .then(([p, d, a]) => setStats({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length }))
      .catch(() => {});
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFF' }}>

      {/* STICKY NAV */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8ECF8', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(8px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, bgcolor: BRAND, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: 'Georgia, serif' }}>M</Typography>
          </Box>
          <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 18, color: INK, letterSpacing: -0.5 }}>MediCare</Typography>
          <Box sx={{ width: 1, height: 18, bgcolor: '#DDE3F5', mx: 1 }} />
          <Typography sx={{ fontSize: 11, color: '#8892B0', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Admin</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ px: 2, py: 0.5, borderRadius: 10, bgcolor: '#ECFDF5', border: '1px solid #6EE7B7' }}>
            <Typography sx={{ fontSize: 11, color: '#065F46', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', display: 'inline-block', mr: 0.5 }} />
              System Live
            </Typography>
          </Box>
          <Avatar sx={{ width: 36, height: 36, bgcolor: BRAND, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif', boxShadow: `0 0 0 3px ${BRAND}20` }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {/* HERO — INK DARK */}
      <Box sx={{ bgcolor: INK, px: { xs: 3, md: 6 }, pt: { xs: 6, md: 8 }, pb: 0, overflow: 'hidden', position: 'relative' }}>
        <Typography sx={{ position: 'absolute', right: -10, top: -20, fontSize: { xs: 160, md: 260 }, fontWeight: 900, color: 'rgba(255,255,255,0.022)', lineHeight: 1, userSelect: 'none', fontFamily: 'Georgia, serif', pointerEvents: 'none', letterSpacing: -10 }}>M+</Typography>
        <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
          {/* Greeting strip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 6, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: ACCENT }} />
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Good {greeting}, {user?.name?.split(' ')[0]}</Typography>
            </Box>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.05)', minWidth: 40 }} />
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'sans-serif' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={7}>
              <Typography sx={{ fontSize: { xs: 54, md: 82, lg: 100 }, fontWeight: 900, color: 'white', lineHeight: 0.9, letterSpacing: -4, fontFamily: 'Georgia, serif', mb: 5 }}>
                Modern<br />
                <Box component="span" sx={{ color: BRAND }}>Patient</Box><br />
                Care
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 7, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Box sx={{ width: 3, height: 56, bgcolor: BRAND, borderRadius: 2, flexShrink: 0, mt: 0.25 }} />
                <Typography sx={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 420, fontFamily: 'sans-serif', flex: 1 }}>
                  A unified platform for managing patients, doctors and appointments — built for the demands of modern healthcare administration.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button onClick={() => navigate('/dashboard')} endIcon={<NorthEastIcon sx={{ fontSize: 15 }} />}
                  sx={{ px: 4, py: 1.5, bgcolor: BRAND, color: 'white', fontWeight: 700, borderRadius: 2, fontSize: 14, fontFamily: 'sans-serif', textTransform: 'none', '&:hover': { bgcolor: '#0044CC', transform: 'translateY(-2px)', boxShadow: `0 12px 30px ${BRAND}60` }, transition: 'all 0.25s ease', boxShadow: `0 6px 20px ${BRAND}40` }}>
                  Open Dashboard
                </Button>
                <Button onClick={() => navigate('/appointments')}
                  sx={{ px: 4, py: 1.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, borderRadius: 2, fontSize: 14, fontFamily: 'sans-serif', textTransform: 'none', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.8)' }, transition: 'all 0.2s' }}>
                  Book Appointment
                </Button>
              </Box>
            </Grid>

            {/* Right: stacked live counters */}
            <Grid item xs={12} md={5}>
              <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.07)', pl: { xs: 0, md: 5 }, borderTop: { xs: '1px solid rgba(255,255,255,0.07)', md: 'none' }, pt: { xs: 4, md: 0 } }}>
                {[
                  { label: 'Total Patients', value: stats.patients, color: BRAND, sub: 'Registered in system' },
                  { label: 'Active Doctors', value: stats.doctors, color: ACCENT, sub: 'Medical professionals' },
                  { label: 'Appointments', value: stats.appointments, color: WARM, sub: 'All time total' },
                ].map(({ label, value, color, sub }, i) => (
                  <Box key={label} sx={{ py: 3, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default', transition: 'background 0.2s', px: 2, mx: -2, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase', mb: 0.5 }}>{label}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'sans-serif' }}>{sub}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ color: 'white', fontSize: 44, fontWeight: 900, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{value}</Typography>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 12px ${color}` }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Feature strip */}
          <Box sx={{ mt: 8, borderTop: '1px solid rgba(255,255,255,0.05)', py: 3, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {['Full CRUD Operations', 'JWT Authentication', 'REST API Backend', 'Real-time Analytics', 'Responsive UI'].map((t, i) => (
              <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {i > 0 && <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)' }} />}
                <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif', letterSpacing: 0.2 }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* MODULES GRID */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 7, maxWidth: 1300 + 96, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: BRAND, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'sans-serif', mb: 1.5 }}>System Modules</Typography>
            <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 900, color: INK, fontFamily: 'Georgia, serif', letterSpacing: -1.5, lineHeight: 1.1 }}>Quick Access</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: '#94A3B8', maxWidth: 280, lineHeight: 1.7, fontFamily: 'sans-serif' }}>
            Select a module to manage your healthcare operations
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {modules.map(({ label, icon: Icon, path, desc, color, bg, number, tag }) => (
            <Grid item xs={12} sm={6} key={path}>
              <Box onClick={() => navigate(path)} sx={{ borderRadius: 3.5, border: '1.5px solid #E8ECF8', bgcolor: 'white', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', '&:hover': { borderColor: color, transform: 'translateY(-5px)', boxShadow: `0 20px 50px ${color}15` }, '&:hover .m-bar': { transform: 'scaleX(1)', opacity: 1 }, '&:hover .m-ghost': { color: `${color}18` }, '&:hover .m-arrow': { opacity: 1, transform: 'translateX(0)' }, position: 'relative' }}>
                <Box className="m-bar" sx={{ height: 3, bgcolor: color, transformOrigin: 'left', transform: 'scaleX(0)', opacity: 0, transition: 'all 0.45s ease' }} />
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography className="m-ghost" sx={{ fontSize: 64, fontWeight: 900, color: '#F0F3FC', lineHeight: 1, fontFamily: 'Georgia, serif', transition: 'color 0.3s ease', userSelect: 'none', mt: -1 }}>{number}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ px: 1.75, py: 0.6, borderRadius: 1.5, bgcolor: bg }}>
                        <Typography sx={{ fontSize: 10, color, fontWeight: 800, letterSpacing: 1.5, fontFamily: 'sans-serif' }}>{tag}</Typography>
                      </Box>
                      <Box className="m-arrow" sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.3s ease' }}>
                        <ArrowForwardIcon sx={{ fontSize: 15, color }} />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: 2.5, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon sx={{ color, fontSize: 25 }} />
                    </Box>
                    <Typography sx={{ fontSize: 23, fontWeight: 900, color: INK, fontFamily: 'Georgia, serif', letterSpacing: -0.5 }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.75, fontFamily: 'sans-serif' }}>{desc}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FOOTER BAR */}
      <Box sx={{ mx: { xs: 3, md: 6 }, mb: 6, p: 3.5, borderRadius: 3, bgcolor: INK, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 44, height: 44, bgcolor: BRAND, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: 20, fontFamily: 'Georgia, serif' }}>M</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'Georgia, serif' }}>MediCare Admin Portal</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'sans-serif' }}>Full Stack · React · Node.js · MongoDB</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Frontend', v: 'React + MUI' }, { label: 'Backend', v: 'Node + Express' }, { label: 'Database', v: 'MongoDB Atlas' }].map(({ label, v }) => (
            <Box key={label}>
              <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'sans-serif', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, fontFamily: 'sans-serif', fontWeight: 600, mt: 0.25 }}>{v}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}