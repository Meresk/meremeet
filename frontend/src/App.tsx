import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import RoomPage from './pages/RoomPage';
import NotFound from './pages/NotFound';
import { DefaultBackground, DarkBackground } from './components/Backgrounds';
import './styles/App.module.css';

function App() {
  const location = useLocation();
  
  const showDarkBackground = 
    location.pathname !== '/' && 
    !location.pathname.startsWith('/user/') && 
    !location.pathname.startsWith('/room/');

  return (
    <>
      {showDarkBackground ? <DarkBackground /> : <DefaultBackground />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;