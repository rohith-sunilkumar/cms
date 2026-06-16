import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Clock, AlertTriangle, CheckCircle, Ticket } from 'lucide-react';
import api from '../api/api';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'low' });
    
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (!userStr) {
            navigate('/login');
            return;
        }
        fetchTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            const { data } = await api.get('/tickets');
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch tickets', error);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', newTicket);
            setShowCreate(false);
            setNewTicket({ title: '', description: '', priority: 'low' });
            fetchTickets();
        } catch (error) {
            console.error('Failed to create ticket', error);
        }
    };

    const getStatusBadge = (status) => {
        return <span className={`badge badge-${status}`}>{status}</span>;
    };

    const getPriorityBadge = (priority) => {
        return <span className={`badge badge-${priority}`}>{priority}</span>;
    };

    const isSlaBreached = (deadline) => {
        return new Date(deadline) < new Date();
    };

    if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

    // Super Admin SLA Stats
    const totalTickets = tickets.length;
    const breachedTickets = tickets.filter(t => isSlaBreached(t.slaDeadline) && t.status !== 'closed' && t.status !== 'resolved').length;
    const openTickets = tickets.filter(t => t.status === 'open').length;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Dashboard</h2>
                {user?.role === 'user' && (
                    <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                        <Plus size={18} /> New Ticket
                    </button>
                )}
            </div>

            {user?.role === 'superadmin' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Ticket size={32} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                        <h3>{totalTickets}</h3>
                        <p className="text-muted">Total Tickets</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Clock size={32} className="text-info" style={{ margin: '0 auto 1rem' }} />
                        <h3>{openTickets}</h3>
                        <p className="text-muted">Open Tickets</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', border: breachedTickets > 0 ? '1px solid var(--danger)' : '' }}>
                        <AlertTriangle size={32} className="text-danger" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: 'var(--danger)' }}>{breachedTickets}</h3>
                        <p className="text-muted">SLA Breaches</p>
                    </div>
                </div>
            )}

            {showCreate && user?.role === 'user' && (
                <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3>Create New Ticket</h3>
                    <form onSubmit={handleCreateTicket} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                required 
                                value={newTicket.title}
                                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select 
                                className="form-select"
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                className="form-textarea" 
                                rows="4" 
                                required
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit Ticket</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Tickets</h3>
                </div>
                
                {tickets.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">
                        No tickets found.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }} className="text-muted">
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Subject</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Priority</th>
                                    {user?.role !== 'user' && <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Creator</th>}
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>SLA</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(ticket => {
                                    const breached = isSlaBreached(ticket.slaDeadline) && ticket.status !== 'closed' && ticket.status !== 'resolved';
                                    return (
                                        <tr key={ticket._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <Link to={`/ticket/${ticket._id}`} style={{ fontFamily: 'monospace' }}>
                                                    #{ticket._id.substring(ticket._id.length - 6)}
                                                </Link>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{ticket.title}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(ticket.status)}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>{getPriorityBadge(ticket.priority)}</td>
                                            {user?.role !== 'user' && <td style={{ padding: '1rem 1.5rem' }}>{ticket.creator?.name || 'Unknown'}</td>}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                {breached ? (
                                                    <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                                        <AlertTriangle size={14} /> Breached
                                                    </span>
                                                ) : ticket.status === 'closed' || ticket.status === 'resolved' ? (
                                                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                                        <CheckCircle size={14} /> Met
                                                    </span>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                        {new Date(ticket.slaDeadline).toLocaleDateString()} {new Date(ticket.slaDeadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <Link to={`/ticket/${ticket._id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                                    {user?.role === 'user' ? 'View' : 'View & Solve'}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple TicketIcon component since we can't import easily at top level inside map
const TicketIcon = ({ size, className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
        <path d="M13 5v2"></path>
        <path d="M13 17v2"></path>
        <path d="M13 11v2"></path>
    </svg>
);

export default Dashboard;
