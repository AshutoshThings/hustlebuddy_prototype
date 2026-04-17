import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Ecosystem
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import DashboardEngine from './components/dashboard/DashboardEngine';
import DashboardApplications from './components/dashboard/DashboardApplications';
import DashboardResume from './components/dashboard/DashboardResume';
// import DashboardVault from './components/dashboard/DashboardVault';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('hb_token');
  
  if (!token) {
    // If no token, send them to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        {/* 2. Wrap the routes you want to protect */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
               <DashboardLayout>
                 <Routes>
                   <Route path="/" element={<DashboardHome />} />
                   <Route path="engine" element={<DashboardEngine />} />
                   <Route path="applications" element={<DashboardApplications />} />
                   <Route path="resume" element={<DashboardResume />} />
                   {/* <Route path="vault" element={<DashboardVault />} /> */}
                 </Routes>
               </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}