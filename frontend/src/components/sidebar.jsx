import { Link } from 'react-router-dom';

const Sidebar = () => {
    const role = localStorage.getItem('role');

    return (
        <div style={{ width: '200px', background: '#34495e', color: 'white', height: '100vh', padding: '20px' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px' }}>
                    <Link to={role === 'admin' ? '/admin-dashboard' : '/dept-dashboard'} style={{ color: 'white', textDecoration: 'none' }}>🏠 Dashboard</Link>
                </li>
                {role === 'admin' && (
                    <li style={{ marginBottom: '15px' }}>
                        <Link to="/manage-users" style={{ color: 'white', textDecoration: 'none' }}>👥 Manage Users</Link>
                    </li>
                )}
                <li style={{ marginBottom: '15px' }}>
                    <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>👤 Profile Settings</Link>
                </li>
            </ul>
        </div>
    );
};
export default Sidebar;