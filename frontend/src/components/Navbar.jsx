import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '0 auto' }}>
                <Link to="/" className="navbar-brand">
                    <span>Complaint Management System</span>
                </Link>
                
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.75rem', 
                            backgroundColor: 'rgba(255,255,255,0.5)', 
                            padding: '0.35rem 1rem 0.35rem 0.35rem', 
                            borderRadius: '999px', 
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ 
                                width: '36px', height: '36px', borderRadius: '50%', 
                                backgroundColor: 'var(--primary)', color: 'white', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontWeight: 'bold', fontSize: '1rem' 
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{user.name}</span>
                                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>{user.role}</span>
                            </div>
                        </div>
                        <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
