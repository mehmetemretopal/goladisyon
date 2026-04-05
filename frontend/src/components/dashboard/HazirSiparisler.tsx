import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, Chip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Order } from '../../App';

interface Props {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const HazirSiparisler: React.FC<Props> = ({ orders, setOrders }) => {
  const readyOrders = orders.filter(o => o.status === 'hazir');

  const handleComplete = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'tamamlandi' } : o));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>Hazır Siparişler</Typography>
      
      {readyOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">Şu anda hazırda bekleyen sipariş bulunmamaktadır.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {readyOrders.map(order => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'success.main' }}>
                <CardContent sx={{ flexGrow: 1, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Masa: {order.table}</Typography>
                    <Chip size="small" label="Hazır" color="success" icon={<CheckCircle sx={{ color: 'white !important' }} />} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Detaylar:</Typography>
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
                    color="secondary"
                    onClick={() => handleComplete(order.id)}
                  >
                    Garsona Teslim Edildi
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

export default HazirSiparisler;
