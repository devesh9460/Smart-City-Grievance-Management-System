import { useState, useEffect } from 'react';
import API from '../../api';
import Navbar from '../../components/navbar';

const UserDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Waste Management'
    });
    const [feedbackTarget, setFeedbackTarget] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    
    const userName = localStorage.getItem('userName');

    // 1. Complaints Fetch karne ka logic
    const fetchMyComplaints = async () => {
        try {
            console.log('Token present:', !!localStorage.getItem('token'));
            // Humne backend mein '/complaints/my' banaya hai specific user ke liye
            const { data } = await API.get('/complaints/my'); 
            console.log('Fetched complaints:', data);
            setComplaints(data);
        } catch (err) {
            console.error("Error fetching complaints:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchMyComplaints();
    }, []);

    // 2. Complaint Submit karne ka logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/complaints', formData);
            alert("✅ Shikayat darj ho gayi!");
            setShowModal(false);
            setFormData({ title: '', description: '', category: 'Waste Management' });
            fetchMyComplaints();
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.error || "Submit nahi ho paya"));
        }
    };

    const submitFeedback = async () => {
        if (!feedbackTarget || feedbackText.trim() === '') return;
        try {
            await API.put(`/complaints/${feedbackTarget}`, { feedback: feedbackText });
            alert('Feedback saved. Thank you!');
            setFeedbackTarget(null);
            setFeedbackText('');
            fetchMyComplaints();
        } catch (err) {
            alert('Feedback submit nahi hua.');
        }
    };

    return (
        <div style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '30px', maxWidth: '1000px', margin: 'auto' }}>
                <h1>Welcome, {userName || 'User'} 👋</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>My Grievances</h3>
                    <button 
                        onClick={() => setShowModal(true)}
                        style={{ padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Raise New Complaint
                    </button>
                </div>

                {/* --- Complaints Table --- */}
                <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {complaints.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                            You haven't filed any complaints yet.
                        </p>
                    ) : (
                        <table width="100%" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#2c3e50', color: '#fff' }}>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map(c => (
                                    <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>
                                            <strong>{c.title}</strong>
                                            {c.response && (
                                                <div style={{ marginTop: '8px', color: '#555', fontSize: '13px' }}>
                                                    <strong>Response:</strong> {c.response}
                                                </div>
                                            )}
                                            {c.feedback && (
                                                <div style={{ marginTop: '6px', color: '#2d3436', fontSize: '13px' }}>
                                                    <strong>Feedback:</strong> {c.feedback}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px' }}>{c.category}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold',
                                                background: c.status === 'Resolved' ? '#d4edda' : '#fff3cd',
                                                color: c.status === 'Resolved' ? '#155724' : '#856404',
                                                border: `1px solid ${c.status === 'Resolved' ? '#c3e6cb' : '#ffeeba'}`
                                            }}>
                                                {c.status}
                                            </span>
                                            {c.status === 'Resolved' && !c.feedback && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <button
                                                        onClick={() => {
                                                            setFeedbackTarget(c._id);
                                                            setFeedbackText('');
                                                        }}
                                                        style={{
                                                            marginTop: '6px', padding: '6px 10px', background: '#0984e3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'
                                                        }}
                                                    >
                                                        Give Feedback
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {feedbackTarget && (
                    <div style={{ background: '#fff', padding: '20px', marginTop: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0 }}>Feedback for resolved complaint</h3>
                        <textarea
                            rows="4"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Please share your feedback about how the complaint was handled"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setFeedbackTarget(null)}
                                style={{ padding: '10px 18px', background: '#bdc3c7', color: '#2d3436', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >Cancel</button>
                            <button
                                type="button"
                                onClick={submitFeedback}
                                style={{ padding: '10px 18px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >Submit Feedback</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL POPUP --- */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>New Complaint</h2>
                        <form onSubmit={handleSubmit}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Title</label>
                            <input 
                                type="text" 
                                placeholder="Issue ka naam (e.g. Broken Pipe)" 
                                required
                                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />

                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category</label>
                            <select 
                                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                value={formData.category}
                            >
                                <option value="Waste Management">Garbage Collection (Waste)</option>
                                <option value="Drainage/Sewage">Drainage/Sewage</option>
                                <option value="Water Supply">Water Supply</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Road/Potholes">Road/Potholes</option>
                                <option value="Street Lights">Street Lights</option>
                                <option value="Other">Other</option>
                            </select>

                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Description</label>
                            <textarea 
                                rows="4" 
                                placeholder="Poori samasya batayein..." 
                                required
                                style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '15px' }}>
    {/* CANCEL BUTTON */}
    <button 
        type="button" 
        onClick={() => setShowModal(false)}
        style={{ 
            padding: '12px 24px', 
            background: '#f1f2f6', 
            color: '#57606f', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.background = '#dfe4ea'}
        onMouseOut={(e) => e.target.style.background = '#f1f2f6'}
    >
        Discard
    </button>

    {/* SUBMIT BUTTON */}
    <button 
        type="submit" 
        style={{ 
            padding: '12px 28px', 
            background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', // Premium Green Gradient
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)', // Soft Green Glow
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)';
        }}
        onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.3)';
        }}
    >
        Submit Complaint
    </button>
</div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;