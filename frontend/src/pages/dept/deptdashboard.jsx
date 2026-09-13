import { useState, useEffect } from 'react';
import API from '../../api';
import Navbar from '../../components/navbar';

const DeptDashboard = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [selected, setSelected] = useState({});
    const [responseText, setResponseText] = useState({});

    const fetchDeptComplaints = async () => {
        try {
            console.log('Fetching dept complaints, role:', localStorage.getItem('role'));
            const { data } = await API.get('/complaints');
            setMyTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDeptComplaints();
    }, []);

    const handleUpdate = async (id) => {
        try {
            const payload = { status: selected[id] || 'In Progress' };
            if (responseText[id]) payload.response = responseText[id];
            await API.put(`/complaints/${id}`, payload);
            alert('Task updated successfully');
            setResponseText(prev => ({ ...prev, [id]: '' }));
            setSelected(prev => ({ ...prev, [id]: '' }));
            fetchDeptComplaints();
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div style={{ background: '#f6f8fb', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1100px', margin: 'auto' }}>
                <h2>Department Dashboard</h2>
                <p>Manage tasks assigned to your department. Update status and leave a response once work progresses.</p>

                {myTasks.length === 0 ? (
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center', color: '#555' }}>
                        No tasks found yet.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                        {myTasks.map(t => (
                            <div key={t._id} style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>{t.title}</h3>
                                    <span style={{ color: '#636e72', fontSize: '14px' }}>{t.assignedDept}</span>
                                </div>
                                <p style={{ color: '#444', minHeight: '60px' }}>{t.description}</p>
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Status:</strong>
                                    <span style={{ marginLeft: '8px', color: '#2d3436' }}>{t.status}</span>
                                </div>
                                {t.response && (
                                    <div style={{ marginBottom: '10px', color: '#2d3436' }}>
                                        <strong>Previous Response:</strong>
                                        <div style={{ marginTop: '6px', background: '#f1f2f6', padding: '10px', borderRadius: '6px' }}>{t.response}</div>
                                    </div>
                                )}
                                <select
                                    value={selected[t._id] || ''}
                                    onChange={(e) => setSelected({ ...selected, [t._id]: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '10px' }}
                                >
                                    <option value="">Select status update</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                <textarea
                                    rows="3"
                                    value={responseText[t._id] || ''}
                                    placeholder="Leave a short response or note for the user"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '12px' }}
                                    onChange={(e) => setResponseText(prev => ({ ...prev, [t._id]: e.target.value }))}
                                />
                                <button
                                    onClick={() => handleUpdate(t._id)}
                                    style={{ width: '100%', padding: '12px 18px', background: '#0984e3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Save Task Update
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default DeptDashboard;