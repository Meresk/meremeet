import Logo from './assets/mm-b-1.svg';
import styles from './App.module.css';
import ParticlesBackground from './components/ParticlesBackground';
import CanvasBackground from './components/CanvasBackground';
import { useState } from 'react';
import RoomModal from './components/RoomModal';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogoClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
            <RoomModal isOpen={isModalOpen} onClose={handleCloseModal} />

            { /* Creator text */ }
            <div className={styles.creatortxt}>
                by. meresk.
            </div>
        </div>
    )
}

export default App;