import { useState } from 'react';
import API from '../api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', creds);
            
            // LocalStorage data saving
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('userName', data.user.name);

            // Redirect logic based on role
            if (data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (data.user.role === 'department') {
                navigate('/dept-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err) {
            alert("Login Failed: " + (err.response?.data?.msg || "Check credentials"));
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* Left Side: Futuristic Hero Section */}
            <div style={styles.heroSide}>
                <div style={styles.overlay}>
                    <h1 style={styles.heroTitle}>SmartCity 2026</h1>
                    <p style={styles.heroSubtitle}>
                        Empowering citizens through digital governance. 
                        Report issues, track progress, and build a better city together.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form Section */}
            <div style={styles.formSide}>
                <div style={styles.loginCard}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '8px' }}>Welcome Back</h2>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                required 
                                style={styles.input}
                                onChange={e => setCreds({...creds, email: e.target.value})} 
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                style={styles.input}
                                onChange={e => setCreds({...creds, password: e.target.value})} 
                            />
                        </div>
                        
                        <button type="submit" style={styles.loginBtn}>
                            Sign In
                        </button>
                    </form>

                    <p style={styles.footerText}>
                        New to SmartCity? <Link to="/register" style={styles.link}>Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- STYLES OBJECT ---
const styles = {
    pageContainer: {
        display: 'flex',
        height: '100vh',
        width: '100%',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden'
    },
    heroSide: {
        flex: 1.5,
        backgroundImage: 'url("https://img.freepik.com/premium-photo/smart-city-infrastructure-futuristic-background_1152148-979.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex'
    },
    overlay: {
        flex: 1,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 80px',
        color: '#fff',
        backdropFilter: 'blur(3px)'
    },
    heroTitle: { fontSize: '60px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' },
    heroSubtitle: { fontSize: '20px', lineHeight: '1.6', color: '#cbd5e1', maxWidth: '500px' },
    formSide: {
        flex: 1,
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    loginCard: {
        width: '100%',
        maxWidth: '450px',
        padding: '50px',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    inputGroup: { marginBottom: '24px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.2s',
        background: '#f1f5f9'
    },
    loginBtn: {
        width: '100%',
        padding: '14px',
        background: '#0f172a',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginTop: '10px'
    },
    footerText: { textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '14px' },
    link: { color: '#2563eb', textDecoration: 'none', fontWeight: '600' }
};

export default Login;