import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import api, { API_URL } from './api/api';

function ServerConnectionCheck({ children }) {
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking' | 'healthy' | 'waking' | 'error' | 'misconfigured'
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    // Detect if we are misconfigured on production
    const isLocalhostApi = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
    const isProductionClient = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1';

    if (isProductionClient && isLocalhostApi) {
      setConnectionStatus('misconfigured');
      return;
    }

    setConnectionStatus('checking');

    // If it takes more than 1.5 seconds, show the "waking up" message
    const slowTimer = setTimeout(() => {
      if (active) {
        setConnectionStatus('waking');
      }
    }, 1500);

    const pingServer = async () => {
      try {
        await api.get('/health');
        if (active) {
          clearTimeout(slowTimer);
          setConnectionStatus('healthy');
        }
      } catch (err) {
        if (active) {
          clearTimeout(slowTimer);
          // If relative API URL fails in production, it's also a misconfiguration
          if (isProductionClient && API_URL === '/api') {
            setConnectionStatus('misconfigured');
          } else {
            setConnectionStatus('error');
          }
        }
      }
    };

    pingServer();

    return () => {
      active = false;
      clearTimeout(slowTimer);
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (connectionStatus === 'healthy') {
    return children;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem',
      color: 'var(--text-main)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '2.5rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        {connectionStatus === 'checking' && (
          <>
            <div className="spinner-loader" style={{ marginBottom: '1.5rem' }}></div>
            <h2 style={{ marginBottom: '0.75rem' }}>Connecting to Server</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              Checking connection to the Complaint Management backend...
            </p>
          </>
        )}

        {connectionStatus === 'waking' && (
          <>
            <div className="spinner-loader waking" style={{ marginBottom: '1.5rem' }}></div>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              Waking Up Backend
            </h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              We're starting up the server instance on Render. Free tier services spin down after inactivity and can take up to a minute to start.
            </p>
            <div style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--info)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              fontSize: '0.875rem',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '1rem'
            }}>
              Please hang tight! This page will load automatically once ready.
            </div>
          </>
        )}

        {connectionStatus === 'misconfigured' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Configuration Required</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', textAlign: 'left', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              The application is running in production, but we couldn't connect to the backend. This is usually because the API URL is not set.
            </p>
            <div style={{
              textAlign: 'left',
              backgroundColor: 'rgba(15, 23, 42, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              wordBreak: 'break-all'
            }}>
              <strong>Configured API URL:</strong> <code style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{API_URL}</code>
              <br/><br/>
              <strong>To fix this on Render:</strong>
              <ol style={{ marginLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li>Go to your Frontend Static Site dashboard on Render.</li>
                <li>Navigate to <strong>Environment</strong> settings.</li>
                <li>Add a new variable: <strong><code>VITE_API_URL</code></strong></li>
                <li>Set its value to your backend Web Service URL (e.g. <code>https://your-backend.onrender.com/api</code>).</li>
                <li>Trigger a redeployment of the static site.</li>
              </ol>
            </div>
            <button className="btn btn-primary" onClick={handleRetry} style={{ width: '100%' }}>
              Check Connection Again
            </button>
          </>
        )}

        {connectionStatus === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Server Offline</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              We were unable to connect to the backend server. The backend might be offline or undergoing maintenance.
            </p>
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.05)', 
              color: 'var(--danger)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginBottom: '1.5rem',
              fontFamily: 'monospace'
            }}>
              Target: {API_URL}
            </div>
            <button className="btn btn-primary" onClick={handleRetry} style={{ width: '100%' }}>
              Retry Connection
            </button>
          </>
        )}
      </div>
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
          </Routes>
        </ServerConnectionCheck>
      </div>
    </Router>
  );
}

export default App;
