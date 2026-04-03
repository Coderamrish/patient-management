import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Table, TableHead, TableRow, TableCell, TableBody, Avatar, LinearProgress, Stack, IconButton, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import api from '../api/axios';

const BRAND = '#0057FF';
const ACCENT = '#00C896';
const WARM = '#FF6B35';
const INK = '#0A0E1A';
const VIOLET = '#7C3AED';

const statusStyle = {
  Scheduled: { bg: '#EEF4FF', color: BRAND, dot: BRAND },
  Completed: { bg: '#EDFAF5', color: '#065F46', dot: ACCENT },
  Cancelled: { bg: '#FFF1F0', color: '#991B1B', dot: '#FF4D4D' },
};

const Pill = ({ label, status }) => {
  const s = statusStyle[status] || { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' };
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 0.5, borderRadius: 10, bgcolor: s.bg }}>
      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: s.dot }} />
      <Typography sx={{ fontSize: 12, color: s.color, fontWeight: 700, fontFamily: 'sans-serif' }}>{label}</Typography>
    </Box>
  );
};

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ts, setTs] = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const [p, d, a] = await Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')]);
      setPatients(p.data); setDoctors(d.data); setAppointments(a.data); setTs(new Date());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const rate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;
  const bars = [42, 67, 55, 88, 73, 91, 64];

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'white', fontWeight: 900, fontSize: 28, fontFamily: 'Georgia, serif' }}>M</Typography>
      </Box>
      <Typography sx={{ color: INK, fontWeight: 700, fontSize: 18, fontFamily: 'Georgia, serif' }}>Loading Dashboard</Typography>
      <LinearProgress sx={{ width: 200, borderRadius: 4, height: 3, bgcolor: '#E8ECF8', '& .MuiLinearProgress-bar': { bgcolor: BRAND, borderRadius: 4 } }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6FB' }}>

      {/* TOP HEADER */}
      <Box sx={{ px: { xs: 3, md: 5 }, py: 0, bgcolor: INK, position: 'relative', overflow: 'hidden' }}>
        <Typography sx={{ position: 'absolute', right: -10, top: -15, fontSize: 180, fontWeight: 900, color: 'rgba(255,255,255,0.02)', fontFamily: 'Georgia, serif', userSelect: 'none', letterSpacing: -8 }}>DB</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'sans-serif', mb: 1 }}>Analytics Overview</Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, color: 'white', fontFamily: 'Georgia, serif', letterSpacing: -1.5, lineHeight: 1 }}>Dashboard</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ px: 2.5, py: 1, borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.04)' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'sans-serif' }}>
                {ts.toLocaleTimeString()}
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton onClick={load} sx={{ width: 38, height: 38, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', '&:hover': { bgcolor: `${BRAND}30`, color: '#60A5FA', borderColor: `${BRAND}50` }, transition: 'all 0.2s' }}>
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* KPI strip inside dark header */}
        <Box sx={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          {[
            { label: 'Patients', value: patients.length, color: BRAND, delta: '+12%', up: true },
            { label: 'Doctors', value: doctors.length, color: ACCENT, delta: 'Active', up: true },
            { label: 'Appointments', value: appointments.length, color: WARM, delta: 'All time', up: true },
            { label: 'Scheduled', value: scheduled, color: VIOLET, delta: 'Upcoming', up: true },
          ].map(({ label, value, color, delta, up }, i) => (
            <Box key={label} sx={{ flex: 1, minWidth: 140, p: 3, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.025)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.35, borderRadius: 10, bgcolor: `${color}15`, border: `1px solid ${color}25` }}>
                  {up ? <NorthEastIcon sx={{ fontSize: 10, color }} /> : <SouthEastIcon sx={{ fontSize: 10, color }} />}
                  <Typography sx={{ fontSize: 10, color, fontWeight: 700, fontFamily: 'sans-serif' }}>{delta}</Typography>
                </Box>
              </Box>
              <Typography sx={{ color: 'white', fontSize: 40, fontWeight: 900, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{value}</Typography>
              <Box sx={{ mt: 2, height: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                <Box sx={{ height: '100%', width: `${Math.min((value / Math.max(patients.length, 1)) * 100, 100)}%`, bgcolor: color, borderRadius: 1 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Grid container spacing={3} mb={3}>

          {/* Donut + stats */}
          <Grid item xs={12} md={4}>
            <Box sx={{ borderRadius: 3.5, bgcolor: 'white', border: '1.5px solid #E8ECF8', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ p: 3.5, borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ fontWeight: 800, color: INK, fontSize: 16, fontFamily: 'Georgia, serif' }}>Completion Rate</Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 12, fontFamily: 'sans-serif', mt: 0.5 }}>Appointment breakdown</Typography>
              </Box>
              <Box sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, position: 'relative' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="62" fill="none" stroke="#F1F5F9" strokeWidth="16" />
                    <circle cx="80" cy="80" r="62" fill="none" stroke={BRAND} strokeWidth="16"
                      strokeDasharray={`${rate * 3.895} 389.5`} strokeLinecap="round" transform="rotate(-90 80 80)"
                      style={{ transition: 'stroke-dasharray 1s ease' }} />
                  </svg>
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 34, fontWeight: 900, color: INK, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{rate}%</Typography>
                    <Typography sx={{ fontSize: 11, color: '#94A3B8', fontFamily: 'sans-serif', mt: 0.5 }}>Completed</Typography>
                  </Box>
                </Box>
                <Stack spacing={1.5}>
                  {[
                    { label: 'Completed', value: completed, color: ACCENT, icon: CheckCircleIcon },
                    { label: 'Scheduled', value: scheduled, color: BRAND, icon: AccessTimeIcon },
                    { label: 'Cancelled', value: cancelled, color: '#FF4D4D', icon: CancelIcon },
                  ].map(({ label, value, color, icon: Icon }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.75, borderRadius: 2.5, border: '1px solid #F1F5F9', bgcolor: '#FAFBFF', transition: 'all 0.2s', '&:hover': { borderColor: `${color}30`, bgcolor: `${color}05`, transform: 'translateX(3px)' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon sx={{ fontSize: 16, color }} />
                        </Box>
                        <Typography sx={{ fontSize: 13, color: '#475569', fontWeight: 600, fontFamily: 'sans-serif' }}>{label}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 22, fontWeight: 900, color: INK, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Bar chart */}
          <Grid item xs={12} md={8}>
            <Box sx={{ borderRadius: 3.5, bgcolor: 'white', border: '1.5px solid #E8ECF8', overflow: 'hidden', height: '100%' }}>
              <Box sx={{ p: 3.5, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: INK, fontSize: 16, fontFamily: 'Georgia, serif' }}>Weekly Activity</Typography>
                  <Typography sx={{ color: '#94A3B8', fontSize: 12, fontFamily: 'sans-serif', mt: 0.5 }}>Appointment volume — last 7 days</Typography>
                </Box>
                <Box sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: '#EEF4FF', border: '1px solid #C7D8FF' }}>
                  <Typography sx={{ fontSize: 12, color: BRAND, fontWeight: 700, fontFamily: 'sans-serif' }}>Peak: 91</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200, mb: 2 }}>
                  {bars.map((val, i) => (
                    <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: '100%', position: 'relative', height: `${(val / 91) * 175}px`, borderRadius: '6px 6px 0 0', bgcolor: i === 5 ? BRAND : '#E8ECF8', transition: 'all 0.3s ease', '&:hover': { bgcolor: BRAND, transform: 'scaleY(1.04)', transformOrigin: 'bottom' }, cursor: 'default' }}>
                        <Box sx={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', opacity: 0, transition: '0.2s', '&:hover': { opacity: 1 } }}>
                          <Typography sx={{ fontSize: 11, color: BRAND, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>{val}</Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, fontFamily: 'sans-serif' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F8FAFE', border: '1px solid #E8ECF8', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NorthEastIcon sx={{ fontSize: 16, color: ACCENT }} />
                  <Typography sx={{ fontSize: 12.5, color: '#64748B', fontFamily: 'sans-serif' }}>
                    Peak activity recorded on Saturdays — highest appointment volume day
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Recent Patients */}
        <Box sx={{ borderRadius: 3.5, bgcolor: 'white', border: '1.5px solid #E8ECF8', overflow: 'hidden', mb: 3 }}>
          <Box sx={{ px: 4, py: 3, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: INK }}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: 15, fontFamily: 'Georgia, serif' }}>Recent Patients</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'sans-serif', mt: 0.25 }}>Latest registrations</Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.75, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 600 }}>{patients.length} total</Typography>
            </Box>
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFBFF' }}>
                {['Patient', 'Age', 'Phone', 'Blood Group', 'Status'].map(h => (
                  <TableCell key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, py: 2, fontFamily: 'sans-serif', borderBottom: '1px solid #F1F5F9' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.slice(0, 5).map(p => (
                <TableRow key={p._id} sx={{ '&:hover': { bgcolor: '#F8FAFE' }, '&:last-child td': { border: 0 }, transition: '0.15s' }}>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: BRAND, fontSize: 14, fontWeight: 800, fontFamily: 'Georgia, serif' }}>{p.name?.charAt(0).toUpperCase()}</Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: INK, fontFamily: 'sans-serif' }}>{p.name}</Typography>
                        {p.email && <Typography sx={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'sans-serif' }}>{p.email}</Typography>}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', color: '#475569', fontSize: 13, fontFamily: 'sans-serif' }}>{p.age} yrs</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', color: '#64748B', fontSize: 13, fontFamily: 'sans-serif' }}>{p.phone}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC' }}>
                    <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.5, borderRadius: 10, bgcolor: '#FFF7ED', border: '1px solid #FDE68A' }}>
                      <Typography sx={{ fontSize: 12, color: '#92400E', fontWeight: 800, fontFamily: 'sans-serif' }}>{p.bloodGroup || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC' }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 0.5, borderRadius: 10, bgcolor: '#EDFAF5' }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: ACCENT }} />
                      <Typography sx={{ fontSize: 12, color: '#065F46', fontWeight: 600, fontFamily: 'sans-serif' }}>Active</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {patients.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: '#94A3B8', fontFamily: 'sans-serif', border: 0 }}>No patients yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Box>

        {/* Recent Appointments */}
        <Box sx={{ borderRadius: 3.5, bgcolor: 'white', border: '1.5px solid #E8ECF8', overflow: 'hidden' }}>
          <Box sx={{ px: 4, py: 3, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: INK }}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: 15, fontFamily: 'Georgia, serif' }}>Recent Appointments</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'sans-serif', mt: 0.25 }}>Latest scheduled visits</Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.75, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 600 }}>{appointments.length} total</Typography>
            </Box>
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFBFF' }}>
                {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status'].map(h => (
                  <TableCell key={h} sx={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, py: 2, fontFamily: 'sans-serif', borderBottom: '1px solid #F1F5F9' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(0, 6).map(a => (
                <TableRow key={a._id} sx={{ '&:hover': { bgcolor: '#F8FAFE' }, '&:last-child td': { border: 0 }, transition: '0.15s' }}>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: VIOLET, fontSize: 13, fontWeight: 700, fontFamily: 'Georgia, serif' }}>{a.patient?.name?.charAt(0).toUpperCase()}</Avatar>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK, fontFamily: 'sans-serif' }}>{a.patient?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', color: '#475569', fontSize: 13, fontFamily: 'sans-serif', fontWeight: 500 }}>Dr. {a.doctor?.name}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', color: '#64748B', fontSize: 13, fontFamily: 'sans-serif' }}>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC' }}>
                    <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.4, borderRadius: 1.5, bgcolor: '#F8FAFC', border: '1px solid #E8ECF8' }}>
                      <Typography sx={{ fontSize: 12, color: '#64748B', fontFamily: 'sans-serif', fontWeight: 600 }}>{a.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC', color: '#64748B', fontSize: 13, fontFamily: 'sans-serif' }}>{a.reason || 'Regular checkup'}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #F8FAFC' }}>
                    <Pill label={a.status} status={a.status} />
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: '#94A3B8', fontFamily: 'sans-serif', border: 0 }}>No appointments yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}