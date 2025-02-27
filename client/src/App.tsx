import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/pages/Home/Home.tsx';
import { Login } from './components/pages/Login/Login.tsx';
import { Register } from './components/pages/Register/Register.tsx';
import useUser from './hooks/useUser.ts';

function App() {
  const { isLoggedIn } = useUser();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
