import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AppUserMock } from '../../App';

interface Props {
  personnels: AppUserMock[];
  setPersonnels: React.Dispatch<React.SetStateAction<AppUserMock[]>>;
}

const PersonelYonetimi: React.FC<Props> = ({ personnels, setPersonnels }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('garson');
  const [tableCount, setTableCount] = useState<number | ''>(10);

  const handleAdd = () => {
    if (username && displayName && tableCount !== '') {
      setPersonnels([...personnels, { id: Date.now(), username, displayName, role, tableCount: Number(tableCount) }]);
      setUsername('');
      setDisplayName('');
      setTableCount(10);
    }
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setPersonnels(personnels.map(p => p.id === id ? { ...p, role: newRole } : p));
  };

  const handleDisplayNameChange = (id: number, newName: string) => {
    setPersonnels(personnels.map(p => p.id === id ? { ...p, displayName: newName } : p));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Yeni Personel Ekle</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Kullanıcı Adı" size="small" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="Bölümü (Örn: Aile Bölümü)" size="small" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rol</InputLabel>
              <Select value={role} label="Rol" onChange={e => setRole(e.target.value)}>
                <MenuItem value="garson">Garson</MenuItem>
                <MenuItem value="mutfak">Mutfak</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Masa Sayısı" type="number" size="small" sx={{ width: 100 }} value={tableCount} onChange={e => setTableCount(Number(e.target.value))} />
            <Button variant="contained" onClick={handleAdd}>Ekle</Button>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Mevcut Personeller</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kullanıcı Adı</TableCell>
                <TableCell>Bölümü / Görünür Adı</TableCell>
                <TableCell>Masa Sayısı</TableCell>
                <TableCell>Rol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personnels.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.username}</TableCell>
                  <TableCell>
                    <TextField size="small" value={p.displayName} onChange={e => handleDisplayNameChange(p.id, e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" type="number" sx={{ width: 70 }} value={p.tableCount || 0} onChange={e => setPersonnels(personnels.map(pers => pers.id === p.id ? { ...pers, tableCount: Number(e.target.value) } : pers))} />
                  </TableCell>
                  <TableCell>
                    <Select size="small" value={p.role} onChange={e => handleRoleChange(p.id, e.target.value as string)}>
                      <MenuItem value="garson">Garson</MenuItem>
                      <MenuItem value="mutfak">Mutfak</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PersonelYonetimi;
