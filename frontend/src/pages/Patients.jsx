import { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton,
  MenuItem, Chip, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

const empty = { name:'', age:'', gender:'Male', phone:'', email:'', address:'', bloodGroup:'', medicalHistory:'' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => { const {data} = await api.get('/patients'); setPatients(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setOpen(true); };
  const openEdit = (p) => { setForm(p); setEditId(p._id); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/patients/${editId}`, form);
      else await api.post('/patients', form);
      setOpen(false); load();
    } catch(e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) { await api.delete(`/patients/${id}`); load(); }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h5" fontWeight={600}>Patients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Patient</Button>
      </Box>

      <Paper elevation={1}>
        <Table>
          <TableHead sx={{ bgcolor:'#f5f7fa' }}>
            <TableRow>
              {['Name','Age','Gender','Phone','Blood Group','Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight:600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map(p => (
              <TableRow key={p._id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell><Chip label={p.gender} size="small" /></TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.bloodGroup || '—'}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py:4, color:'text.secondary' }}>No patients yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, pt:'16px !important' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
          <Box sx={{ display:'flex', gap:2 }}>
            <TextField label="Age" type="number" value={form.age} onChange={e => setForm({...form,age:e.target.value})} sx={{ flex:1 }} />
            <TextField select label="Gender" value={form.gender} onChange={e => setForm({...form,gender:e.target.value})} sx={{ flex:1 }}>
              {['Male','Female','Other'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Box>
          <TextField label="Phone" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
          <TextField label="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
          <TextField label="Blood Group" value={form.bloodGroup} onChange={e => setForm({...form,bloodGroup:e.target.value})} />
          <TextField label="Address" value={form.address} onChange={e => setForm({...form,address:e.target.value})} multiline rows={2} />
          <TextField label="Medical History" value={form.medicalHistory} onChange={e => setForm({...form,medicalHistory:e.target.value})} multiline rows={2} />
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}