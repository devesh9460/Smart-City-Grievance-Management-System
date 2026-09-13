import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import UserDashboard from './pages/user/userdashboard';
import AdminDashboard from './pages/admin/admindashboard';
import DeptDashboard from './pages/dept/deptdashboard';
import ManageUsers from './pages/admin/manageusers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<ManageUsers />} />
        <Route path="/dept-dashboard" element={<DeptDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;