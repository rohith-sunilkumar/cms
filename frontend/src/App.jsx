import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import CreateUser from './pages/CreateUser';
import api from './api/api';

function ServerConnectionCheck({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const checkConnection = async () => {
      try {
        await api.get('/health');
        if (active) {
          setIsReady(true);
        }
      } catch (err) {
        if (active) {
          // Auto-retry checking connection every 3 seconds
          setTimeout(checkConnection, 3000);
        }
      }
    };

    checkConnection();

    return () => {
      active = false;
    };
  }, []);

  if (isReady) {
    return children;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <div className="spinner-loader"></div>
      <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
        Connecting to server...
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingBottom: '3rem' }}>
        <ServerConnectionCheck>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
            <Route path="/create-user" element={<CreateUser />} />
          </Routes>
        </ServerConnectionCheck>
      </div>
    </Router>
  );
}

export default App;
