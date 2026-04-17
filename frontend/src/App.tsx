import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardHome from './components/dashboard/DashboardHome';
import DashboardLayout from './components/dashboard/DashboardLayout';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/dashboard" element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;