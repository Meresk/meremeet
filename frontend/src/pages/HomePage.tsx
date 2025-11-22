import Logo from '../assets/logomm.svg';
import styles from '../styles/App.module.css';
import { useState } from 'react';
import RoomModal from '../components/Modals/EnterRoomModal';
import LoginModal from '../components/Modals/LoginModal';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/authService';

function HomePage() {
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        setIsRoomModalOpen(true);
    };

    const handleCreatorClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/dashboard');
            return;
        }
        setIsLoginModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsRoomModalOpen(false);
        setIsLoginModalOpen(false);
    };

    const handleRoomEnter = (roomId: string) => {
        navigate(`/room/${roomId}`);
    };

    const handleLoginSuccess = () => {
        navigate('/dashboard');
    };

    return (
        <div className={styles.app}>
            <div 
                className={styles.logoContainer} 
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            >
                <img src={Logo} alt="Logo" className={styles.logo}/>
            </div>

            {/* Модальные окна*/}
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