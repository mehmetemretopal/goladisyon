import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { People, RestaurantMenu } from '@mui/icons-material';
import { MenuItem, AppUserMock } from '../../App';

interface Props {
  personnels: AppUserMock[];
  menus: MenuItem[];
}

const GenelDurum: React.FC<Props> = ({ personnels, menus }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'white', mr: 2 }}>
              <People />
            </Box>
            <Box>
              <Typography color="text.secondary" variant="body2">Kayıtlı Personel</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{personnels.length}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'secondary.light', color: 'white', mr: 2 }}>
              <RestaurantMenu />
            </Box>
            <Box>
              <Typography color="text.secondary" variant="body2">Menü Ürün Sayısı</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{menus.length}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GenelDurum;
