import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Chip, Avatar, LinearProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../api/axios';

const statusColors = { Scheduled:'primary', Completed:'success', Cancelled:'error' };

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')])
      .then(([p, d, a]) => {
        setPatients(p.data); setDoctors(d.data); setAppointments(a.data);
        setLoading(false);
      });
  }, []);

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const completionRate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: PeopleIcon, color: '#1565C0', bg: '#E3F2FD', trend: '+2 this week' },
    { label: 'Total Doctors', value: doctors.length, icon: LocalHospitalIcon, color: '#00897B', bg: '#E0F2F1', trend: 'Active staff' },
    { label: 'Appointments', value: appointments.length, icon: CalendarMonthIcon, color: '#6A1B9A', bg: '#F3E5F5', trend: 'All time' },
    { label: 'Scheduled', value: scheduled, icon: CheckCircleIcon, color: '#EF6C00', bg: '#FFF3E0', trend: 'Upcoming' },
  ];

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <LinearProgress sx={{ borderRadius: 2 }} />
      <Typography color="text.secondary" mt={2} textAlign="center">Loading dashboard...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#1a1a2e">Dashboard Overview</Typography>
        <Typography color="text.secondary" variant="body2" mt={0.5}>
          Real-time summary of your patient management system
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card elevation={0} sx={{
              border: '1px solid #e8ecf0',
              borderRadius: 3,
              transition: '0.2s',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: bg }}>
                    <Icon sx={{ fontSize: 28, color }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
                    <Typography variant="caption" color="#4CAF50" fontWeight={500}>{trend}</Typography>
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="#1a1a2e">{value}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e8ecf0', borderRadius: 3, p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Appointment Completion</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
              <Typography variant="body2" fontWeight={600}>{completionRate}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={completionRate}
              sx={{ height: 8, borderRadius: 4, bgcolor: '#e8ecf0', '& .MuiLinearProgress-bar': { bgcolor: '#00897B', borderRadius: 4 } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#00897B">{completed}</Typography>
                <Typography variant="caption" color="text.secondary">Completed</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#1565C0">{scheduled}</Typography>
                <Typography variant="caption" color="text.secondary">Scheduled</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#E53935">
                  {appointments.filter(a => a.status === 'Cancelled').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Cancelled</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: '1px solid #e8ecf0', borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e8ecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600}>Recent Patients</Typography>
              <Chip label={`${patients.length} total`} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 500 }} />
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafbfc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Blood</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.slice(0, 5).map(p => (
                  <TableRow key={p._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1565C0', fontSize: 13 }}>
                          {p.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2">{p.age} yrs</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{p.phone}</Typography></TableCell>
                    <TableCell>
                      <Chip label={p.bloodGroup || 'N/A'} size="small"
                        sx={{ bgcolor: '#FFF3E0', color: '#EF6C00', fontWeight: 600, fontSize: 11 }} />
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>No patients yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ border: '1px solid #e8ecf0', borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e8ecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>Recent Appointments</Typography>
          <Chip label={`${appointments.length} total`} size="small" sx={{ bgcolor: '#F3E5F5', color: '#6A1B9A', fontWeight: 500 }} />
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafbfc' }}>
              {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.slice(0, 5).map(a => (
              <TableRow key={a._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#6A1B9A', fontSize: 12 }}>
                      {a.patient?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>{a.patient?.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="body2">Dr. {a.doctor?.name}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{new Date(a.date).toLocaleDateString()}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{a.time}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{a.reason || '—'}</Typography></TableCell>
                <TableCell>
                  <Chip label={a.status} color={statusColors[a.status]} size="small"
                    sx={{ fontWeight: 500, fontSize: 11 }} />
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No appointments yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
