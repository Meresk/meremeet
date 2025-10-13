import Logo from './assets/logomm.svg';
import styles from './styles/App.module.css';
import ParticlesBackground from './components/ParticlesBackground';
import CanvasBackground from './components/CanvasBackground';
import { useState } from 'react';
import RoomModal from './components/RoomModal';
import LoginModal from './components/LoginModal';

function App() {
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [IsLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    return (
        <div className={styles.app}>
            {/* Canvas background*/}
            <CanvasBackground />
            { /* Particles */}
            <ParticlesBackground />

            { /* LOGO */ }
            <div 
                className={styles.logoContainer} 
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            >
                <img src={Logo} alt="Logo" className={styles.logo}/>
            </div>

            { /* Modal window for entry to room*/}
            <RoomModal isOpen={isRoomModalOpen} onClose={handleCloseModal} />

            <LoginModal isOpen={IsLoginModalOpen} onClose={handleCloseModal} />

            { /* Creator text */ }
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

export default App;