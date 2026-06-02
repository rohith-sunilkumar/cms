import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Shield } from 'lucide-react';
import api from '../api/api';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (!userStr) {
            navigate('/login');
            return;
        }
        fetchTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    const fetchTicket = async () => {
        try {
            const { data } = await api.get(`/tickets/${id}`);
            setTicket(data);
            setStatus(data.status);
            setPriority(data.priority);
        } catch (error) {
            console.error('Failed to fetch ticket', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tickets/${id}`, { status, priority });
            fetchTicket();
        } catch (error) {
            console.error('Failed to update ticket', error);
        }
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        try {
            await api.post(`/tickets/${id}/responses`, { message });
            setMessage('');
            fetchTicket();
        } catch (error) {
            console.error('Failed to add response', error);
        }
    };

    const getStatusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;
    const getPriorityBadge = (p) => <span className={`badge badge-${p}`}>{p}</span>;

    if (loading) return <div className="container"><p>Loading ticket details...</p></div>;
    if (!ticket) return <div className="container"><p>Ticket not found.</p></div>;

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    return (
        <div className="container animate-fade-in">
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }} onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{ticket.title}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                            </div>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Raised by <strong>{ticket.creator?.name}</strong> on {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                        
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', lineHeight: 1.6 }}>
                            {ticket.description}
                        </div>
                    </div>

                    {/* Responses */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <MessageSquare size={20} /> Conversation
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                            {ticket.responses.length === 0 ? (
                                <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>No responses yet.</p>
                            ) : (
                                ticket.responses.map(res => {
                                    const isMe = res.sender._id === user._id;
                                    const isStaff = res.sender.role === 'admin' || res.sender.role === 'superadmin';
                                    
                                    return (
                                        <div key={res._id} style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: isMe ? 'flex-end' : 'flex-start' 
                                        }}>
                                            <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                                                {res.sender.name} {isStaff && <Shield size={10} style={{ display: 'inline', color: 'var(--primary)' }} />} • {new Date(res.createdAt).toLocaleString()}
                                            </div>
                                            <div style={{ 
                                                backgroundColor: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                                                padding: '1rem', 
                                                borderRadius: '12px',
                                                borderTopRightRadius: isMe ? '2px' : '12px',
                                                borderTopLeftRadius: isMe ? '12px' : '2px',
                                                maxWidth: '80%'
                                            }}>
                                                {res.message}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {ticket.status !== 'closed' && (
                            <form onSubmit={handleAddResponse} style={{ display: 'flex', gap: '1rem' }}>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Type your message..." 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                                    <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Ticket Details</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ticket ID</div>
                            <div style={{ fontFamily: 'monospace' }}>#{ticket._id}</div>
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>SLA Deadline</div>
                            <div>{new Date(ticket.slaDeadline).toLocaleString()}</div>
                        </div>

                        {isAdmin && ticket.status !== 'closed' ? (
                            <form onSubmit={handleUpdateTicket} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                <div className="form-group">
                                    <label className="form-label">Update Status</label>
                                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Update Priority</label>
                                    <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Update Ticket</button>
                            </form>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TicketDetail;
