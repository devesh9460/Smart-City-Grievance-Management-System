import { useState } from 'react';
import API from '../../api';
import Navbar from '../../components/navbar';
import { useNavigate } from 'react-router-dom';

const RaiseComplaint = () => {
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Road' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/complaints', formData);
            alert("Complaint Submitted!");
            navigate('/user-dashboard');
        } catch (err) { alert("Error!"); }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h3>File a New Grievance</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" placeholder="Subject" onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Road/Potholes">Road/Potholes</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Waste Management">Waste Management</option>
                        <option value="Drainage/Sewage">Drainage/Sewage</option>
                        <option value="Street Lights">Street Lights</option>
                        <option value="Other">Other</option>
                    </select>
                    <textarea placeholder="Details..." onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '10px' }}>Submit</button>
                </form>
            </div>
        </div>
    );
};
export default RaiseComplaint;