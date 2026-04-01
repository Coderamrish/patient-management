import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton,
  Alert, Card, Avatar, Chip, InputAdornment, Stack, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api/axios';

const empty = { name: '', specialization: '', phone: '', email: '', availability: 'Mon-Fri, 9am-5pm' };

const specColors = {
  Cardiology: { bg: '#FEF2F2', color: '#991B1B' },
  Neurology: { bg: '#F5F3FF', color: '#6D28D9' },
  Orthopedics: { bg: '#FFFBEB', color: '#B45309' },
  Pediatrics: { bg: '#ECFDF5', color: '#065F46' },
  General: { bg: '#EFF6FF', color: '#1D4ED8' },
};
const getSpecColor = (spec) => {
  for (const [key, val] of Object.entries(specColors)) {
    if (spec?.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: '#F1F5F9', color: '#475569' };
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => { const { data } = await api.get('/doctors'); setDoctors(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); setOpen(true); };
  const openEdit = (d) => { setForm(d); setEditId(d._id); setError(''); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/doctors/${editId}`, form);
      else await api.post('/doctors', form);
      setOpen(false); load();
    } catch (e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) { await api.delete(`/doctors/${id}`); load(); }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

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
          <Typography variant="overline" sx={{ color: '#0A6EBD', fontWeight: 700, letterSpacing: 2, fontSize: 11 }}>STAFF MANAGEMENT</Typography>
          <Typography variant="h4" fontWeight={800} color="#0C1F3F" mt={0.5}>Doctors</Typography>
          <Typography color="#64748B" variant="body2" mt={0.5}>{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            bgcolor: '#0A6EBD',
            borderRadius: 3,
            px: 3,
            py: 1.25,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(10,110,189,0.35)',
            '&:hover': { bgcolor: '#085FA3', boxShadow: '0 6px 20px rgba(10,110,189,0.45)' },
          }}
        >
          Add Doctor
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3, maxWidth: 420 }}>
        <TextField
          fullWidth
          placeholder="Search by name or specialization..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              '& fieldset': { borderColor: '#E2E8F0' },
              '&:hover fieldset': { borderColor: '#0A6EBD' },
              '&.Mui-focused fieldset': { borderColor: '#0A6EBD' },
            },
          }}
        />
      </Box>

      {/* Table Card */}
      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ px: 3.5, py: 2.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalHospitalIcon sx={{ fontSize: 18, color: '#059669' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#0C1F3F">Medical Staff</Typography>
            <Typography variant="caption" color="#94A3B8">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAFBFC' }}>
              {['Doctor', 'Specialization', 'Contact', 'Availability', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(d => {
              const spec = getSpecColor(d.specialization);
              return (
                <TableRow key={d._id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td': { border: 0 }, transition: '0.15s' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 38, height: 38, bgcolor: '#0A6EBD', fontSize: 15, fontWeight: 700 }}>
                        {d.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0C1F3F">Dr. {d.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={d.specialization} size="small" sx={{ bgcolor: spec.bg, color: spec.color, fontWeight: 700, fontSize: 11, border: `1px solid ${spec.color}25` }} />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                        <Typography variant="body2" color="#475569" fontSize={12}>{d.phone}</Typography>
                      </Box>
                      {d.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <EmailIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                          <Typography variant="body2" color="#64748B" fontSize={12}>{d.email}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                      <Typography variant="body2" color="#475569" fontSize={12}>{d.availability}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => openEdit(d)}
                          sx={{ bgcolor: '#EFF6FF', color: '#0A6EBD', borderRadius: 2, '&:hover': { bgcolor: '#DBEAFE' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(d._id)}
                          sx={{ bgcolor: '#FEF2F2', color: '#DC2626', borderRadius: 2, '&:hover': { bgcolor: '#FEE2E2' } }}
                        >
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
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LocalHospitalIcon sx={{ color: '#CBD5E1', fontSize: 26 }} />
                    </Box>
                    <Typography color="#94A3B8" fontWeight={500}>No doctors found</Typography>
                    <Typography variant="caption" color="#CBD5E1">Add your first doctor to get started</Typography>
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
            <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 18, color: '#059669' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#0C1F3F">{editId ? 'Edit Doctor' : 'Add New Doctor'}</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ bgcolor: '#F1F5F9', borderRadius: 2 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3.5, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}
          <TextField label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={fieldSx} />
          <TextField label="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} sx={fieldSx} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
            <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
          </Box>
          <TextField label="Availability" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} sx={fieldSx} />
        </DialogContent>

        <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2.5, color: '#64748B', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ borderRadius: 2.5, bgcolor: '#0A6EBD', fontWeight: 700, px: 3.5, boxShadow: '0 4px 14px rgba(10,110,189,0.35)', '&:hover': { bgcolor: '#085FA3' } }}
          >
            {editId ? 'Save Changes' : 'Add Doctor'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}