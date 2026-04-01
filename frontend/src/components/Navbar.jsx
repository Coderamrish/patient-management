import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#1565C0' }}>
      <Toolbar>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          MediCare
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[['Home','/'],['Patients','/patients'],['Doctors','/doctors'],['Appointments','/appointments'],['Dashboard','/dashboard']].map(([label, path]) => (
              <Button key={path} color="inherit" component={Link} to={path} sx={{ textTransform: 'none' }}>
                {label}
              </Button>
            ))}
            <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none', ml: 2 }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}