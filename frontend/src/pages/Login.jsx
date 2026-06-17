import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Welcome Back</h2>
                
                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            required 
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            required 
                            placeholder="admin123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                        {loading ? (
                            <>
                                <svg style={{ animation: 'spin 1s infinite linear', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }} className="text-muted">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
