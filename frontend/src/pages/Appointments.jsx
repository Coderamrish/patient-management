import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogContent,
  TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  MenuItem, Chip, Alert, Card, Avatar, InputAdornment, Stack, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../api/axios';

const statusConfig = {
  Scheduled: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Completed: { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  Cancelled: { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
};
const empty = { patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled' };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const load = async () => {
    const [a, p, d] = await Promise.all([api.get('/appointments'), api.get('/patients'), api.get('/doctors')]);
    setAppointments(a.data); setPatients(p.data); setDoctors(d.data);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); setOpen(true); };
  const openEdit = (a) => {
    setForm({ ...a, patient: a.patient?._id || a.patient, doctor: a.doctor?._id || a.doctor, date: a.date?.slice(0, 10) });
    setEditId(a._id); setError(''); setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/appointments/${editId}`, form);
      else await api.post('/appointments', form);
      setOpen(false); load();
    } catch (e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) { await api.delete(`/appointments/${id}`); load(); }
  };

  const filtered = appointments.filter(a => {
    const matchSearch = !search ||
      a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    All: appointments.length,
    Scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      bgcolor: '#FAFBFC',
      '& fieldset': { borderColor: '#E2E8F0' },
      '&:hover fieldset': { borderColor: '#0A6EBD' },
      '&.Mui-focused fieldset': { borderColor: '#0A6EBD' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#0A6EBD' },
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: '#F0F4F8', minHeight: '100vh' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#7C3AED', fontWeight: 700, letterSpacing: 2, fontSize: 11 }}>SCHEDULING</Typography>
          <Typography variant="h4" fontWeight={800} color="#0C1F3F" mt={0.5}>Appointments</Typography>
          <Typography color="#64748B" variant="body2" mt={0.5}>{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} total</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            bgcolor: '#7C3AED',
            borderRadius: 3,
            px: 3,
            py: 1.25,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
            '&:hover': { bgcolor: '#6D28D9', boxShadow: '0 6px 20px rgba(124,58,237,0.45)' },
          }}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Status Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {['All', 'Scheduled', 'Completed', 'Cancelled'].map(status => {
          const active = filterStatus === status;
          const cfg = statusConfig[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
          return (
            <Chip
              key={status}
              label={`${status} (${counts[status]})`}
              onClick={() => setFilterStatus(status)}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                fontSize: 12,
                px: 0.5,
                cursor: 'pointer',
                transition: '0.2s',
                ...(active
                  ? status === 'All'
                    ? { bgcolor: '#0C1F3F', color: 'white', border: '1px solid #0C1F3F' }
                    : { bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
                  : { bgcolor: 'white', color: '#94A3B8', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F8FAFC', color: '#475569' } }
                ),
              }}
            />
          );
        })}
        <Box sx={{ flex: 1 }} />
        <TextField
          placeholder="Search patient or doctor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment>,
          }}
          sx={{
            minWidth: 260,
            '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white', '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#7C3AED' }, '&.Mui-focused fieldset': { borderColor: '#7C3AED' } },
          }}
        />
      </Box>

      {/* Table */}
      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ px: 3.5, py: 2.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: '#7C3AED' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#0C1F3F">Appointment Schedule</Typography>
            <Typography variant="caption" color="#94A3B8">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAFBFC' }}>
              {['Patient', 'Doctor', 'Date & Time', 'Reason', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(a => {
              const sc = statusConfig[a.status] || {};
              return (
                <TableRow key={a._id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td': { border: 0 }, transition: '0.15s' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: '#7C3AED', fontSize: 13, fontWeight: 700 }}>
                        {a.patient?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={700} color="#0C1F3F">{a.patient?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} color="#475569">Dr. {a.doctor?.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={600} color="#0C1F3F">{new Date(a.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                      <Typography variant="caption" color="#94A3B8">{a.time}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#64748B">{a.reason || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={a.status}
                      size="small"
                      sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: 11, border: `1px solid ${sc.border}` }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(a)} sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', borderRadius: 2, '&:hover': { bgcolor: '#EDE9FE' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(a._id)} sx={{ bgcolor: '#FEF2F2', color: '#DC2626', borderRadius: 2, '&:hover': { bgcolor: '#FEE2E2' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarMonthIcon sx={{ color: '#CBD5E1', fontSize: 26 }} />
                    </Box>
                    <Typography color="#94A3B8" fontWeight={500}>No appointments found</Typography>
                    <Typography variant="caption" color="#CBD5E1">Try adjusting your filters or book a new appointment</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 25px 60px rgba(0,0,0,0.15)' } }}>
        <Box sx={{ px: 3.5, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: '#7C3AED' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#0C1F3F">{editId ? 'Edit Appointment' : 'Book Appointment'}</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ bgcolor: '#F1F5F9', borderRadius: 2 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3.5, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}
          <TextField select label="Patient" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} sx={fieldSx}>
            {patients.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
          </TextField>
          <TextField select label="Doctor" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} sx={fieldSx}>
            {doctors.map(d => <MenuItem key={d._id} value={d._id}>Dr. {d.name} — {d.specialization}</MenuItem>)}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ ...fieldSx, flex: 1 }} />
            <TextField label="Time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ ...fieldSx, flex: 1 }} />
          </Box>
          <TextField label="Reason for Visit" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} multiline rows={2} sx={fieldSx} />
          {editId && (
            <TextField select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} sx={fieldSx}>
              {['Scheduled', 'Completed', 'Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
        </DialogContent>

        <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2.5, color: '#64748B', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ borderRadius: 2.5, bgcolor: '#7C3AED', fontWeight: 700, px: 3.5, boxShadow: '0 4px 14px rgba(124,58,237,0.35)', '&:hover': { bgcolor: '#6D28D9' } }}
          >
            {editId ? 'Save Changes' : 'Book Appointment'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}