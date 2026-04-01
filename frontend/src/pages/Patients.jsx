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
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import api from '../api/axios';

const empty = { name: '', age: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: '', medicalHistory: '' };

const bloodGroupColors = {
  'A+': { bg: '#FEF2F2', color: '#991B1B' },
  'A-': { bg: '#FFF1F2', color: '#BE123C' },
  'B+': { bg: '#FFF7ED', color: '#C2410C' },
  'B-': { bg: '#FFFBEB', color: '#B45309' },
  'O+': { bg: '#F0FDF4', color: '#15803D' },
  'O-': { bg: '#ECFDF5', color: '#065F46' },
  'AB+': { bg: '#EFF6FF', color: '#1D4ED8' },
  'AB-': { bg: '#F5F3FF', color: '#6D28D9' },
};

const genderConfig = {
  Male: { bg: '#EFF6FF', color: '#1D4ED8' },
  Female: { bg: '#FDF4FF', color: '#86198F' },
  Other: { bg: '#F1F5F9', color: '#475569' },
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');

  const load = async () => { const { data } = await api.get('/patients'); setPatients(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); setOpen(true); };
  const openEdit = (p) => { setForm(p); setEditId(p._id); setError(''); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/patients/${editId}`, form);
      else await api.post('/patients', form);
      setOpen(false); load();
    } catch (e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) { await api.delete(`/patients/${id}`); load(); }
  };

  const filtered = patients.filter(p => {
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search);
    const matchGender = genderFilter === 'All' || p.gender === genderFilter;
    return matchSearch && matchGender;
  });

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

  const genderCounts = {
    All: patients.length,
    Male: patients.filter(p => p.gender === 'Male').length,
    Female: patients.filter(p => p.gender === 'Female').length,
    Other: patients.filter(p => p.gender === 'Other').length,
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: '#F0F4F8', minHeight: '100vh' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#0A6EBD', fontWeight: 700, letterSpacing: 2, fontSize: 11 }}>PATIENT RECORDS</Typography>
          <Typography variant="h4" fontWeight={800} color="#0C1F3F" mt={0.5}>Patients</Typography>
          <Typography color="#64748B" variant="body2" mt={0.5}>{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</Typography>
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
          Add Patient
        </Button>
      </Box>

      {/* Filters Row */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Male', 'Female', 'Other'].map(g => {
          const active = genderFilter === g;
          const cfg = genderConfig[g] || { bg: '#F1F5F9', color: '#475569' };
          return (
            <Chip
              key={g}
              label={`${g} (${genderCounts[g]})`}
              onClick={() => setGenderFilter(g)}
              sx={{
                borderRadius: 3, fontWeight: 700, fontSize: 12, px: 0.5, cursor: 'pointer', transition: '0.2s',
                ...(active
                  ? g === 'All'
                    ? { bgcolor: '#0C1F3F', color: 'white', border: '1px solid #0C1F3F' }
                    : { bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }
                  : { bgcolor: 'white', color: '#94A3B8', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F8FAFC', color: '#475569' } }
                ),
              }}
            />
          );
        })}
        <Box sx={{ flex: 1 }} />
        <TextField
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment>,
          }}
          sx={{
            minWidth: 260,
            '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white', '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#0A6EBD' }, '&.Mui-focused fieldset': { borderColor: '#0A6EBD' } },
          }}
        />
      </Box>

      {/* Table */}
      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ px: 3.5, py: 2.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PeopleIcon sx={{ fontSize: 18, color: '#0A6EBD' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#0C1F3F">Patient Registry</Typography>
            <Typography variant="caption" color="#94A3B8">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAFBFC' }}>
              {['Patient', 'Age & Gender', 'Contact', 'Blood Group', 'Medical History', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(p => {
              const bgColor = bloodGroupColors[p.bloodGroup] || { bg: '#F1F5F9', color: '#475569' };
              const gColor = genderConfig[p.gender] || { bg: '#F1F5F9', color: '#475569' };
              return (
                <TableRow key={p._id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td': { border: 0 }, transition: '0.15s' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 38, height: 38, bgcolor: '#0A6EBD', fontSize: 15, fontWeight: 700 }}>
                        {p.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0C1F3F">{p.name}</Typography>
                        {p.email && <Typography variant="caption" color="#94A3B8">{p.email}</Typography>}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={600} color="#0C1F3F">{p.age} yrs</Typography>
                      <Chip label={p.gender} size="small" sx={{ bgcolor: gColor.bg, color: gColor.color, fontWeight: 700, fontSize: 10, height: 20, width: 'fit-content' }} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                        <Typography variant="body2" color="#475569" fontSize={12}>{p.phone}</Typography>
                      </Box>
                      {p.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <EmailIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                          <Typography variant="body2" color="#64748B" fontSize={12}>{p.email}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.bloodGroup || 'N/A'}
                      size="small"
                      sx={{ bgcolor: bgColor.bg, color: bgColor.color, fontWeight: 800, fontSize: 12, border: `1px solid ${bgColor.color}30` }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#64748B" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.medicalHistory || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(p)} sx={{ bgcolor: '#EFF6FF', color: '#0A6EBD', borderRadius: 2, '&:hover': { bgcolor: '#DBEAFE' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(p._id)} sx={{ bgcolor: '#FEF2F2', color: '#DC2626', borderRadius: 2, '&:hover': { bgcolor: '#FEE2E2' } }}>
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
                      <PeopleIcon sx={{ color: '#CBD5E1', fontSize: 26 }} />
                    </Box>
                    <Typography color="#94A3B8" fontWeight={500}>No patients found</Typography>
                    <Typography variant="caption" color="#CBD5E1">Try adjusting your filters or register a new patient</Typography>
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
            <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonIcon sx={{ fontSize: 18, color: '#0A6EBD' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#0C1F3F">{editId ? 'Edit Patient' : 'Register New Patient'}</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ bgcolor: '#F1F5F9', borderRadius: 2 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3.5, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>}
          <TextField label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required sx={fieldSx} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
            <TextField select label="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} sx={{ ...fieldSx, flex: 1 }}>
              {['Male', 'Female', 'Other'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
            <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
          </Box>
          <TextField select label="Blood Group" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} sx={fieldSx}>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </TextField>
          <TextField label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} multiline rows={2} sx={fieldSx} />
          <TextField label="Medical History" value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} multiline rows={2} sx={fieldSx} />
        </DialogContent>

        <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2.5, color: '#64748B', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ borderRadius: 2.5, bgcolor: '#0A6EBD', fontWeight: 700, px: 3.5, boxShadow: '0 4px 14px rgba(10,110,189,0.35)', '&:hover': { bgcolor: '#085FA3' } }}
          >
            {editId ? 'Save Changes' : 'Register Patient'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}