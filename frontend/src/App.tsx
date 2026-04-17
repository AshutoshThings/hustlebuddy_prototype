import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;