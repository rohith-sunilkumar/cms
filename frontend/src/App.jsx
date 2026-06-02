import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
