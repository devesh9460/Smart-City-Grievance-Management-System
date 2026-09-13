import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Navbar from '../../components/navbar';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const navigate = useNavigate();

    const fetchAll = async () => {
        try {
            const [{ data: complaintsData }, { data: analyticsData }] = await Promise.all([
                API.get('/complaints'),
                API.get('/complaints/analytics/summary')
            ]);
            setComplaints(complaintsData);
            setAnalytics(analyticsData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await API.put(`/complaints/${id}`, { status: newStatus });
            alert('Status Updated!');
            fetchAll();
        } catch (err) {
            alert('Update failed');
        }
    };

    const deleteComplaint = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            await API.delete(`/complaints/${id}`);
            alert('Complaint deleted');
            fetchAll();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h2>Admin Panel</h2>
                        <p>City-wide complaint analytics and management.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin-users')}
                        style={{ padding: '10px 18px', background: '#0984e3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Manage Users
                    </button>
                </div>

                {analytics && (
                    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '25px' }}>
                        {[
                            { label: 'Total Complaints', value: analytics.total },
                            { label: 'Resolved', value: analytics.resolved },
                            { label: 'In Progress', value: analytics.inProgress },
                            { label: 'Pending', value: analytics.pending },
                            { label: 'Rejected', value: analytics.rejected }
                        ].map(stat => (
                            <div key={stat.label} style={{ flex: '1 1 150px', background: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                                <div style={{ color: '#636e72', marginBottom: '8px' }}>{stat.label}</div>
                                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <table width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#2d3436', color: '#fff' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left' }}>User</th>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Dept</th>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id} style={{ borderBottom: '1px solid #e6e6e6' }}>
                                    <td style={{ padding: '14px' }}>{c.user?.name || 'Unknown'}</td>
                                    <td style={{ padding: '14px' }}>{c.title}</td>
                                    <td style={{ padding: '14px' }}>{c.category}</td>
                                    <td style={{ padding: '14px' }}>{c.assignedDept}</td>
                                    <td style={{ padding: '14px', color: c.status === 'Resolved' ? '#27ae60' : '#e17055' }}>{c.status}</td>
                                    <td style={{ padding: '14px' }}>
                                        <select onChange={(e) => updateStatus(c._id, e.target.value)} style={{ marginRight: '10px' }}>
                                            <option value="">Update</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <button
                                            onClick={() => deleteComplaint(c._id)}
                                            style={{ padding: '7px 12px', background: '#d63031', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                        >Delete</button>
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
export default AdminDashboard;