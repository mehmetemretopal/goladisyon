import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, Divider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { AddShoppingCart, Delete, ArrowBack } from '@mui/icons-material';
import { AppUserMock, MenuItem, Order } from '../../App';

interface Props {
  tableNo: string;
  menus: MenuItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  user: AppUserMock;
  onBack: () => void;
}

const YeniAdisyon: React.FC<Props> = ({ tableNo, menus, orders, setOrders, user, onBack }) => {
  const [cart, setCart] = useState<MenuItem[]>([]);

  // Categorize menus
  const categories = Array.from(new Set(menus.map(m => m.category)));

  const handleAddToCart = (menu: MenuItem) => {
    setCart([...cart, menu]);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSendOrder = () => {
    if (cart.length > 0) {
      // Find if order already exists for this table
      const existingOrderIndex = orders.findIndex(o => o.table === tableNo && o.status !== 'odendi');
      
      if (existingOrderIndex >= 0) {
        // Append items to existing order
        const updatedOrders = [...orders];
        updatedOrders[existingOrderIndex].items = [...updatedOrders[existingOrderIndex].items, ...cart];
        updatedOrders[existingOrderIndex].status = 'bekliyor'; // New items added, so back to waiting for kitchen
        setOrders(updatedOrders);
      } else {
        // Create new order
        const newOrder: Order = {
          id: Date.now(),
          table: tableNo,
          items: cart,
          status: 'bekliyor',
          garsonName: user.displayName || user.username
        };
        setOrders([...orders, newOrder]);
      }
      
      setCart([]);
      alert('Sipariş Mutfağa İletildi!');
      onBack();
    }
  };

  const totalAmount = cart.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>Masalara Dön</Button>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h5" gutterBottom>Masa {tableNo} - Yeni Adisyon Aç</Typography>
        {categories.map(category => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>{category}</Typography>
            <Grid container spacing={2}>
              {menus.filter(m => m.category === category).map(menu => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={menu.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{menu.name}</Typography>
                      <Typography color="primary" variant="subtitle2" sx={{ mt: 1 }}>{menu.price} TL</Typography>
                    </CardContent>
                    <Box sx={{ p: 1 }}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<AddShoppingCart />}
                        onClick={() => handleAddToCart(menu)}
                      >
                        Ekle
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Grid>
      
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ position: 'sticky', top: 100 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Sepet</Typography>
            <Divider sx={{ my: 2 }} />
            
            {cart.length === 0 ? (
              <Typography color="text.secondary" variant="body2" align="center">Sepetiniz boş</Typography>
            ) : (
              <List disablePadding>
                {cart.map((item, index) => (
                  <ListItem 
                    key={index} 
                    disableGutters 
                    secondaryAction={
                      <IconButton edge="end" size="small" color="error" onClick={() => handleRemoveFromCart(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={item.name} secondary={`${item.price} TL`} />
                  </ListItem>
                ))}
              </List>
            )}
            
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Toplam:</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">{totalAmount} TL</Typography>
            </Box>
            
            <Button 
              fullWidth 
              variant="contained" 
              color="success" 
              size="large"
              disabled={cart.length === 0}
              onClick={handleSendOrder}
            >
              Mutfağa Gönder
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default YeniAdisyon;
