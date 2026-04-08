import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, Chip } from '@mui/material';
import { Order } from '../../App';

interface Props {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const BekleyenSiparisler: React.FC<Props> = ({ orders, setOrders }) => {
  const pendingOrders = orders.filter(o => o.status === 'bekliyor');

  const handleMarkAsReady = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'hazir' } : o));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>Bekleyen Siparişler</Typography>
      
      {pendingOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">Şu anda bekleyen sipariş bulunmamaktadır.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingOrders.map(order => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Masa: {order.table}</Typography>
                    <Chip size="small" label="Bekliyor" color="error" />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', opacity: 0.9 }}>
                    Garson: {order.garsonName}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Siparişler:</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">• {item.name}</Typography>
                    ))}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="success"
                    onClick={() => handleMarkAsReady(order.id)}
                  >
                    Hazırlandı
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BekleyenSiparisler;
