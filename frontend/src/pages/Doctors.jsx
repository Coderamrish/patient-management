import { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

const empty = { name:'', specialization:'', phone:'', email:'', availability:'Mon-Fri, 9am-5pm' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => { const {data} = await api.get('/doctors'); setDoctors(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setOpen(true); };
  const openEdit = (d) => { setForm(d); setEditId(d._id); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/doctors/${editId}`, form);
      else await api.post('/doctors', form);
      setOpen(false); load();
    } catch(e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) { await api.delete(`/doctors/${id}`); load(); }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h5" fontWeight={600}>Doctors</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Doctor</Button>
      </Box>

      <Paper elevation={1}>
        <Table>
          <TableHead sx={{ bgcolor:'#f5f7fa' }}>
            <TableRow>
              {['Name','Specialization','Phone','Email','Availability','Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight:600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(d => (
              <TableRow key={d._id} hover>
                <TableCell>Dr. {d.name}</TableCell>
                <TableCell>{d.specialization}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.email || '—'}</TableCell>
                <TableCell>{d.availability}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => openEdit(d)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(d._id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py:4, color:'text.secondary' }}>No doctors yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, pt:'16px !important' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
          <TextField label="Specialization" value={form.specialization} onChange={e => setForm({...form,specialization:e.target.value})} />
          <TextField label="Phone" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
          <TextField label="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
          <TextField label="Availability" value={form.availability} onChange={e => setForm({...form,availability:e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}