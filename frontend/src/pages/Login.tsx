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
    _event: React.MouseEvent<HTMLElement>,
    newRole: 'garson' | 'mutfak' | 'admin' | null,
  ) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };
//8080 backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await fetch('https:///experiment-beds-introducing-reference.trycloudflare.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ username: data.username, role: data.role, displayName: data.displayName });
          navigate('/dashboard');
        } else {
          alert('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Sunucuya bağlanılamadı.');
      }
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
          <img 
            src="/src/assets/yurtlogo.png" 
            alt="logo" 
            style={{ height: '30px', width: 'auto', display: 'block' }} 
            onError={(e) => (e.currentTarget.style.display = 'none')} 
          />
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.75rem' }}>
            GölAdisyon
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Sisteme giriş yapmak için rolünüzü seçin
        </Typography>

        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={handleRoleChange}
          fullWidth
          sx={{ mb: 2 }}
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
      <Box sx={{ position: 'fixed', bottom: 20, width: '100%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'grey.500', letterSpacing: 1 }}>
          designed by GÖLEKİP 2026
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
