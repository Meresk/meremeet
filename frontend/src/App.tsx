import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/DashboardPage';
import RoomPage from './pages/RoomPage';
import NotFound from './pages/NotFound';
import { DefaultBackground, DarkBackground } from './components/Background/Backgrounds';
import './styles/App.module.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  
  const showDarkBackground = 
    location.pathname !== '/' && 
    !location.pathname.startsWith('/dashboard') && 
    !location.pathname.startsWith('/room/');

  return (
    <>
      {showDarkBackground ? <DarkBackground /> : <DefaultBackground />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProtectedRoute> <UserPage /> </ProtectedRoute>} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;