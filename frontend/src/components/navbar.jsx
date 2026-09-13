import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 20px', background: '#2c3e50', color: 'white' 
        }}>
            <h2>SmartCity 2026</h2>
            <div>
                <span style={{ marginRight: '15px', fontSize: '14px' }}>Role: <b>{role?.toUpperCase()}</b></span>
                <button onClick={handleLogout} style={{ 
                    background: '#e74c3c', color: 'white', border: 'none', 
                    padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' 
                }}>Logout</button>
            </div>
        </nav>
    );
};
export default Navbar;