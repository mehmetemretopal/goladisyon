import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Restaurant, People, Security } from '@mui/icons-material';
import { User } from '../App';

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [role, setRole] = useState<'garson' | 'mutfak' | 'admin'>('garson');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRole: 'garson' | 'mutfak' | 'admin' | null,
  ) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      let dName = "";
      if (username === 'admin') dName = 'Sistem Yöneticisi';
      else if (username === 'garson_aile') dName = 'Aile Bölümü';
      else if (username === 'garson_kadin') dName = 'Kadın Bölümü';
      else if (username === 'garson_erkek') dName = 'Erkek Bölümü';

      setUser({ username, role, displayName: dName });
      navigate('/dashboard');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 450 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <img src="/logo.png" alt="logo" height={40} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <Typography variant="h4" color="primary" align="center">
            gölAdisyon
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Sisteme giriş yapmak için rolünüzü seçin
        </Typography>

        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={handleRoleChange}
          fullWidth
          sx={{ mb: 4 }}
        >
          <ToggleButton value="garson" aria-label="garson">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <People sx={{ mb: 1 }} />
              <Typography variant="caption">Garson</Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="mutfak" aria-label="mutfak">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Restaurant sx={{ mb: 1 }} />
              <Typography variant="caption">Mutfak</Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="admin" aria-label="admin">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Security sx={{ mb: 1 }} />
              <Typography variant="caption">Admin</Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Kullanıcı Adı"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Giriş Yap
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
