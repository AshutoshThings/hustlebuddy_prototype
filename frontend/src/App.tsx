import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Ecosystem
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import DashboardEngine from './components/dashboard/DashboardEngine';
// import DashboardVault from './components/dashboard/DashboardVault';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/dashboard/engine" 
          element={
            <DashboardLayout>
              <DashboardEngine />
            </DashboardLayout>
          } 
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}