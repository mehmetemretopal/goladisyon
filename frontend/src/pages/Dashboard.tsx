import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, IconButton, useMediaQuery, useTheme, Badge
} from '@mui/material';
import {
  ExitToApp, RestaurantMenu, TableBar, People, Menu as MenuIcon,
  Receipt, Dashboard as DashboardIcon, TakeoutDining, Notifications
} from '@mui/icons-material';
import { User, MenuItem, AppUserMock, Order } from '../App';
import GenelDurum from '../components/dashboard/GenelDurum';
import PersonelYonetimi from '../components/dashboard/PersonelYonetimi';
import MenuYonetimi from '../components/dashboard/MenuYonetimi';
import Raporlar from '../components/dashboard/Raporlar';
import Masalarim from '../components/dashboard/Masalarim';
import BekleyenSiparisler from '../components/dashboard/BekleyenSiparisler';
import HazirSiparisler from '../components/dashboard/HazirSiparisler';

const drawerWidth = 260;

export interface DashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  menus: MenuItem[];
  setMenus: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  personnels: AppUserMock[];
  setPersonnels: React.Dispatch<React.SetStateAction<AppUserMock[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser, menus, setMenus, personnels, setPersonnels, orders, setOrders }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = React.useState(
    user.role === 'admin' ? 'Genel Durum' : user.role === 'garson' ? 'Masalarım' : 'Bekleyen Siparişler'
  );

  React.useEffect(() => {
    setActiveTab(user.role === 'admin' ? 'Genel Durum' : user.role === 'garson' ? 'Masalarım' : 'Bekleyen Siparişler');
  }, [user.role]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { text: 'Genel Durum', icon: <DashboardIcon /> },
          { text: 'Personel Yönetimi', icon: <People /> },
          { text: 'Menü Yönetimi', icon: <RestaurantMenu /> },
          { text: 'Raporlar', icon: <Receipt /> },
        ];
      case 'garson':
        return [
          { text: 'Masalarım', icon: <TableBar /> },
        ];
      case 'mutfak':
        return [
          { text: 'Bekleyen Siparişler', icon: <RestaurantMenu /> },
          { text: 'Hazır Siparişler', icon: <TakeoutDining /> },
        ];
      default:
        return [];
    }
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/logo.png" alt="logo" height={30} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            gölAdisyon
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2 }}>
        {getMenuItems().map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              setActiveTab(item.text);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              ...(activeTab === item.text && { bgcolor: 'primary.light', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'primary.contrastText' } })
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user.role === 'admin' ? 'Yönetim Paneli' : user.role === 'garson' ? `Garson Paneli ${user.displayName ? `(${user.displayName})` : ''}` : 'Mutfak Paneli'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {currentTime.toLocaleString('tr-TR')}
            </Typography>
            
            {user.role !== 'admin' && (
              <IconButton color="inherit">
                <Badge 
                  badgeContent={
                    user.role === 'mutfak' 
                      ? orders.filter(o => o.status === 'bekliyor').length 
                      : orders.filter(o => o.status === 'hazir').length
                  } 
                  color="error"
                >
                  <Notifications />
                </Badge>
              </IconButton>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Merhaba, <strong>{user.username}</strong>
            </Typography>
            <IconButton color="error" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, pt: 10, minHeight: '100vh', width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        {user.role === 'admin' && (
          <>
            {activeTab === 'Genel Durum' && <GenelDurum personnels={personnels} menus={menus} />}
            {activeTab === 'Personel Yönetimi' && <PersonelYonetimi personnels={personnels} setPersonnels={setPersonnels} />}
            {activeTab === 'Menü Yönetimi' && <MenuYonetimi menus={menus} setMenus={setMenus} />}
            {activeTab === 'Raporlar' && <Raporlar orders={orders} />}
          </>
        )}

        {user.role === 'garson' && (
          <>
            {activeTab === 'Masalarım' && <Masalarim user={user as AppUserMock} menus={menus} orders={orders} setOrders={setOrders} />}
          </>
        )}

        {user.role === 'mutfak' && (
          <>
            {activeTab === 'Bekleyen Siparişler' && <BekleyenSiparisler orders={orders} setOrders={setOrders} />}
            {activeTab === 'Hazır Siparişler' && <HazirSiparisler orders={orders} setOrders={setOrders} />}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
