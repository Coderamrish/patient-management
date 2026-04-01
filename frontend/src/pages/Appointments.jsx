import { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton,
  MenuItem, Chip, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

const statusColors = { Scheduled:'primary', Completed:'success', Cancelled:'error' };
const empty = { patient:'', doctor:'', date:'', time:'', reason:'', status:'Scheduled' };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [a, p, d] = await Promise.all([api.get('/appointments'), api.get('/patients'), api.get('/doctors')]);
    setAppointments(a.data); setPatients(p.data); setDoctors(d.data);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setOpen(true); };
  const openEdit = (a) => { setForm({ ...a, patient: a.patient?._id || a.patient, doctor: a.doctor?._id || a.doctor, date: a.date?.slice(0,10) }); setEditId(a._id); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/appointments/${editId}`, form);
      else await api.post('/appointments', form);
      setOpen(false); load();
    } catch(e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) { await api.delete(`/appointments/${id}`); load(); }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h5" fontWeight={600}>Appointments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Book Appointment</Button>
      </Box>

      <Paper elevation={1}>
        <Table>
          <TableHead sx={{ bgcolor:'#f5f7fa' }}>
            <TableRow>
              {['Patient','Doctor','Date','Time','Reason','Status','Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight:600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map(a => (
              <TableRow key={a._id} hover>
                <TableCell>{a.patient?.name}</TableCell>
                <TableCell>Dr. {a.doctor?.name}</TableCell>
                <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                <TableCell>{a.time}</TableCell>
                <TableCell>{a.reason || '—'}</TableCell>
                <TableCell><Chip label={a.status} color={statusColors[a.status]} size="small" /></TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => openEdit(a)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(a._id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py:4, color:'text.secondary' }}>No appointments yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, pt:'16px !important' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select label="Patient" value={form.patient} onChange={e => setForm({...form,patient:e.target.value})}>
            {patients.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
          </TextField>
          <TextField select label="Doctor" value={form.doctor} onChange={e => setForm({...form,doctor:e.target.value})}>
            {doctors.map(d => <MenuItem key={d._id} value={d._id}>Dr. {d.name} — {d.specialization}</MenuItem>)}
          </TextField>
          <Box sx={{ display:'flex', gap:2 }}>
            <TextField label="Date" type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} InputLabelProps={{ shrink:true }} sx={{ flex:1 }} />
            <TextField label="Time" type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})} InputLabelProps={{ shrink:true }} sx={{ flex:1 }} />
          </Box>
          <TextField label="Reason" value={form.reason} onChange={e => setForm({...form,reason:e.target.value})} multiline rows={2} />
          {editId && (
            <TextField select label="Status" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
              {['Scheduled','Completed','Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}