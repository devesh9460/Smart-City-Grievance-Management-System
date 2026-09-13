import axios from 'axios';

// Backend URL set kar rahe hain
const API = axios.create({ baseURL: 'http://127.0.0.1:5000/api' });
// Har request ke saath automatic token bhejne ke liye logic
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;