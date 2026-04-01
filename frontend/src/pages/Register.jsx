import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f4f8' }}>
      <Card sx={{ width: 400, p: 2 }} elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>Create Account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Have an account? <Link component={RouterLink} to="/login">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
