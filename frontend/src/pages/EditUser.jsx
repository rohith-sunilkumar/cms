import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const EditUser = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'superadmin') {
            navigate('/');
            return;
        }

        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/auth/users/${id}`);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    password: '', // leave empty unless they want to change it
                    role: data.role || 'user'
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        // Don't send empty password if it hasn't changed
        const updateData = { ...formData };
        if (!updateData.password) {
            delete updateData.password;
        }

        try {
            await api.put(`/auth/users/${id}`, updateData);
            setSuccess('User updated successfully');
            setTimeout(() => navigate('/users'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container"><p>Loading user details...</p></div>;

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit User</h2>
                {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{error}</div>}
                {success && <div className="alert alert-success" style={{ marginBottom: '1rem', color: 'var(--success)' }}>{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-input" 
                            required 
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-input" 
                            required 
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password (Leave blank to keep unchanged)</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-input" 
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                        <select 
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={formData.role === 'superadmin'} // Prevent changing superadmin role from UI just to be safe
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            {formData.role === 'superadmin' && <option value="superadmin">Superadmin</option>}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')} style={{ flex: 1, padding: '0.75rem' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, padding: '0.75rem' }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
