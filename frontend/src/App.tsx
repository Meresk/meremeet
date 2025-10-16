import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import RoomPage from './pages/RoomPage';
import NotFound from './pages/NotFound';
import './styles/App.module.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:userId" element={<UserPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;