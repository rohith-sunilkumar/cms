import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import api from '../api/api';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/auth/users');
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate, currentUser]);

    if (loading) return <div className="container"><p>Loading users...</p></div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>System Users</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    Back to Dashboard
                </button>
            </div>

            {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{error}</div>}

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {users.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">
                        No users found.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }} className="text-muted">
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Name</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Email</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Role</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Joined</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{u.name}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span className={`badge badge-${u.role === 'superadmin' ? 'critical' : u.role === 'admin' ? 'high' : 'low'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }} className="text-muted">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <Link to={`/users/edit/${u._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Edit size={14} /> Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;
