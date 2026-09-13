import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    // Backend model se match karne ke liye 'role' ki default value 'user' rakhi hai
    const [user, setUser] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Check karein ki user object mein kya ja raha hai
            console.log("Sending Data:", user);
            const { data } = await API.post('/auth/register', user);
            alert("Account Created! Please Login.");
            navigate('/'); // Login page par bhej dega
        } catch (err) {
            console.error("Error details:", err.response?.data || err.message);
            alert("Registration Failed: " + (err.response?.data?.msg || err.response?.data?.error || "Unknown Error"));
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            <div style={{ display: 'inline-block', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                <h2>Register for Smart City</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" required 
                        style={{ display: 'block', width: '250px', margin: '10px auto', padding: '10px' }}
                        onChange={e => setUser({...user, name: e.target.value})} />
                    
                    <input type="email" placeholder="Email" required 
                        style={{ display: 'block', width: '250px', margin: '10px auto', padding: '10px' }}
                        onChange={e => setUser({...user, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password" required 
                        style={{ display: 'block', width: '250px', margin: '10px auto', padding: '10px' }}
                        onChange={e => setUser({...user, password: e.target.value})} />
                    
                    <label style={{ display: 'block', marginTop: '10px', fontSize: '14px' }}>Select Role:</label>
                    <select 
                        style={{ display: 'block', width: '272px', margin: '5px auto 15px', padding: '10px' }}
                        onChange={e => setUser({...user, role: e.target.value})}
                    >
                        {/* 'value' hamesha wahi honi chahiye jo backend model ke enum mein hai */}
                        <option value="user">Citizen</option>
                        <option value="admin">Admin</option>
                        <option value="department">Department Official</option>
                    </select>

                    <button type="submit" style={{ width: '270px', padding: '10px', background: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        Create Account
                    </button>
                </form>
                <p>Already have an account? <Link to="/">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;