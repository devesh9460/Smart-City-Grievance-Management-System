import { useState, useEffect } from 'react';
import API from '../../api';
import Navbar from '../../components/navbar';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/auth/users');
            setUsers(data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;
        try {
            await API.delete(`/auth/users/${id}`);
            alert('User deleted');
            fetchUsers();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div style={{ background: '#f8fbfc', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1100px', margin: 'auto' }}>
                <h3>System Users</h3>
                <p>View and manage registered users across the system.</p>
                <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#dfe6e9' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Role</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{u.name}</td>
                                    <td style={{ padding: '12px' }}>{u.email}</td>
                                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button
                                            onClick={() => deleteUser(u._id)}
                                            style={{ padding: '8px 14px', background: '#eb4d4b', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ManageUsers;