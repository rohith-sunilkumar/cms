import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post('/auth/create-user', formData);
            setSuccess('User created successfully');
            setFormData({ name: '', email: '', password: '', role: 'user' });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create New User</h2>
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
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-input" 
                            required 
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
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        >
                            <option value="user">User</option>
                            {user?.role === 'superadmin' && <option value="admin">Admin</option>}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} style={{ flex: 1, padding: '0.75rem' }}>
                            Back
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '0.75rem' }}>
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
