import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { MenuItem as AppMenuItem } from '../../App';

interface Props {
  menus: AppMenuItem[];
  setMenus: React.Dispatch<React.SetStateAction<AppMenuItem[]>>;
}

const MenuYonetimi: React.FC<Props> = ({ menus, setMenus }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (name && category && price) {
      setMenus([...menus, { id: Date.now(), name, category, price: Number(price) }]);
      setName('');
      setCategory('');
      setPrice('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Yeni Menü Kalemi Ekle</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Ürün Adı" size="small" value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Kategori" size="small" value={category} onChange={e => setCategory(e.target.value)} />
            <TextField label="Fiyat (TL)" type="number" size="small" value={price} onChange={e => setPrice(e.target.value)} />
            <Button variant="contained" onClick={handleAdd}>Ekle</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Mevcut Menü Listesi</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Fiyat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.map(menu => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{menu.category}</TableCell>
                  <TableCell>{menu.price} TL</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MenuYonetimi;
