import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '../../App';

interface Props {
  orders?: Order[];
}

const Raporlar: React.FC<Props> = ({ orders = [] }) => {
  // Only completed or paid orders count as revenue
  const completedOrders = orders.filter(o => o.status === 'tamamlandi' || o.status === 'odendi');

  // Total daily revenue
  const totalRevenue = completedOrders.reduce((sum, order) => {
    return sum + order.items.reduce((acc, item) => acc + item.price, 0);
  }, 0);

  // Categorize revenue
  const categoryMap: { [key: string]: number } = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.price;
    });
  });

  const chartData = Object.keys(categoryMap).map(key => ({
    name: key,
    Gelir: categoryMap[key]
  }));

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Masa,Garson,Durum,Tutar (TL)\n";
    orders.forEach(order => {
      const orderTotal = order.items.reduce((acc, curr) => acc + curr.price, 0);
      csvContent += `${order.table},${order.garsonName},${order.status},${orderTotal}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gunun_ozeti.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Gün Sonu Raporları</Typography>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportToCSV}>
          Excel (CSV) İndir
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Toplam Kapanan Masa</Typography>
              <Typography variant="h3" fontWeight="bold">{completedOrders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">Toplam Ciro</Typography>
              <Typography variant="h3" fontWeight="bold">{totalRevenue} TL</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Kategori Bazlı Gelir Dağılımı</Typography>
              <Box sx={{ height: 300 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Gelir" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography color="text.secondary">Yeterli veri yok.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Son İşlemler</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Masa</TableCell>
                    <TableCell>Tutar</TableCell>
                    <TableCell>Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(-5).reverse().map(order => (
                    <TableRow key={order.id}>
                      <TableCell>Masa {order.table}</TableCell>
                      <TableCell>{order.items.reduce((acc, curr) => acc + curr.price, 0)} TL</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Raporlar;
