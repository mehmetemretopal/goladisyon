import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import theme from './theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export interface User {
  username: string;
  role: 'admin' | 'garson' | 'mutfak';
  displayName?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface AppUserMock {
  id: number;
  username: string;
  displayName: string;
  role: string;
  tableCount: number;
}

export interface Order {
  id: number;
  table: string;
  items: MenuItem[];
  status: 'bekliyor' | 'hazir' | 'tamamlandi' | 'odendi';
  garsonName: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [menus, setMenus] = useState<MenuItem[]>([
    { id: 1, name: 'Çay', category: 'İçecek', price: 15 },
    { id: 2, name: 'Adana Kebap', category: 'Ana Yemek', price: 350 },
    { id: 3, name: 'Künefe', category: 'Tatlı', price: 120 }
  ]);

  const [personnels, setPersonnels] = useState<AppUserMock[]>([
    { id: 1, username: 'admin', displayName: 'Sistem Yöneticisi', role: 'admin', tableCount: 0 },
    { id: 2, username: 'garson_aile', displayName: 'Aile Bölümü', role: 'garson', tableCount: 8 },
    { id: 3, username: 'garson_kadin', displayName: 'Kadın Bölümü', role: 'garson', tableCount: 5 },
    { id: 4, username: 'garson_erkek', displayName: 'Erkek Bölümü', role: 'garson', tableCount: 6 }
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws-adisyon'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/orders', (message) => {
          if (message.body) {
            setOrders(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  const broadcastOrders = (newOrders: Order[] | ((prev: Order[]) => Order[])) => {
    setOrders((prevOrders) => {
      const updated = typeof newOrders === 'function' ? newOrders(prevOrders) : newOrders;
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: '/app/orders/update',
          body: JSON.stringify(updated)
        });
      }
      return updated;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route 
            path="/dashboard/*" 
            element={user ? <Dashboard 
              user={user} setUser={setUser} 
              menus={menus} setMenus={setMenus}
              personnels={personnels} setPersonnels={setPersonnels}
              orders={orders} setOrders={broadcastOrders}
            /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
