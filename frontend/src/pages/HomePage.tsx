import Logo from '../assets/logomm.svg';
import styles from '../styles/App.module.css';
import ParticlesBackground from '../components/ParticlesBackground';
import CanvasBackground from '../components/CanvasBackground';
import { useState } from 'react';
import RoomModal from '../components/RoomModal';
import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        setIsRoomModalOpen(true);
    };

    const handleCreatorClick = () => {
        setIsLoginModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsRoomModalOpen(false);
        setIsLoginModalOpen(false);
    };

    // Функции для навигации
    const handleRoomEnter = (roomId: string) => {
        navigate(`/room/${roomId}`);
    };

    const handleLoginSuccess = (userId: string) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className={styles.app}>
            <CanvasBackground />
            <ParticlesBackground />

            <div 
                className={styles.logoContainer} 
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            >
                <img src={Logo} alt="Logo" className={styles.logo}/>
            </div>

            {/* Передаем функции в модальные окна */}
            <RoomModal 
                isOpen={isRoomModalOpen} 
                onClose={handleCloseModal}
                onRoomEnter={handleRoomEnter}
            />

            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={handleCloseModal}
                onLoginSuccess={handleLoginSuccess}
            />

            <div
                className={styles.creatortxt}
                onClick={handleCreatorClick}
                style={{cursor: 'pointer'}}
            >
                by. meresk.
            </div>
        </div>
    )
}

export default HomePage;