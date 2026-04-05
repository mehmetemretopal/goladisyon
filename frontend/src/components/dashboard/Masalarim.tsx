import React, { useState } from 'react';
import { Card, Typography, Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider } from '@mui/material';
import { TableBar } from '@mui/icons-material';
import { AppUserMock, MenuItem, Order } from '../../App';
import YeniAdisyon from './YeniAdisyon';

interface Props {
  user: AppUserMock;
  menus: MenuItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const Masalarim: React.FC<Props> = ({ user, menus, orders, setOrders }) => {
  const [selectedTableToOrder, setSelectedTableToOrder] = useState<string | null>(null);
  const [selectedTableToView, setSelectedTableToView] = useState<string | null>(null);

  const tableCount = user.tableCount || 10;
  const tables = Array.from({ length: tableCount }, (_, i) => `${i + 1}`);

  const getTableOrder = (tableNo: string) => {
    return orders.find(o => o.table === tableNo && o.status !== 'odendi');
  };

  const currentViewOrder = selectedTableToView ? getTableOrder(selectedTableToView) : null;

  const handleTableClick = (tableNo: string) => {
    const activeOrder = getTableOrder(tableNo);
    if (activeOrder) {
      setSelectedTableToView(tableNo);
    } else {
      setSelectedTableToOrder(tableNo);
    }
  };

  const handleCheckOut = () => {
    if (currentViewOrder) {
      setOrders(orders.map(o => o.id === currentViewOrder.id ? { ...o, status: 'odendi' } : o));
      setSelectedTableToView(null);
    }
  };

  // If a table is selected for new order, render YeniAdisyon
  if (selectedTableToOrder) {
    return (
      <YeniAdisyon 
        tableNo={selectedTableToOrder}
        menus={menus}
        orders={orders}
        setOrders={setOrders}
        onBack={() => setSelectedTableToOrder(null)}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>Masalarım ({user.displayName})</Typography>

      <Grid container spacing={3}>
        {tables.map(tableNo => {
          const order = getTableOrder(tableNo);
          
          let bgColor = 'success.light'; // Empty
          let statusText = 'Boş';
          let textColor = 'success.contrastText';

          if (order) {
            if (order.status === 'bekliyor') {
              bgColor = 'warning.light';
              textColor = 'warning.contrastText';
              statusText = 'Mutfak Bekleniyor';
            } else if (order.status === 'hazir') {
              bgColor = 'info.light';
              textColor = 'info.contrastText';
              statusText = 'Sipariş Hazır';
            }
          }

          return (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={tableNo}>
              <Card 
                sx={{ 
                  height: 120, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: bgColor,
                  color: textColor,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => handleTableClick(tableNo)}
              >
                <TableBar sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">Masa {tableNo}</Typography>
                <Typography variant="caption">{statusText}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog for viewing active table and receiving payment */}
      <Dialog open={!!selectedTableToView} onClose={() => setSelectedTableToView(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Masa {selectedTableToView} Adisyonu</DialogTitle>
        <DialogContent dividers>
          {currentViewOrder && (
            <List>
              {currentViewOrder.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.name} secondary={item.category} />
                  <Typography variant="body2" fontWeight="bold">{item.price} TL</Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText primary={<Typography fontWeight="bold">Genel Toplam</Typography>} />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {currentViewOrder.items.reduce((acc, i) => acc + i.price, 0)} TL
                </Typography>
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={() => setSelectedTableToOrder(selectedTableToView as string)} color="primary" variant="outlined">
            Adisyona Ekleme Yap
          </Button>
          <Box>
            <Button onClick={() => setSelectedTableToView(null)} sx={{ mr: 1 }}>İptal</Button>
            <Button onClick={handleCheckOut} variant="contained" color="success">Hesabı Kapat (Ödeme Al)</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Masalarim;
