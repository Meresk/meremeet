import { useState } from 'react';
import styles from '../styles/UserPage.module.css';
import CreateRoomModal from '../components/CreateRoomModal';
import RoomListModal from '../components/RoomListModal';
import { authService } from '../services/auth/authService';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);

    const existingRooms = [
        { id: 1, name: 'Shadow Realm', users: 3, isPrivate: true },
        { id: 2, name: 'Digital Abyss', users: 8, isPrivate: false },
        { id: 3, name: 'Neon Void', users: 1, isPrivate: true },
        { id: 4, name: 'Cyber Sanctuary', users: 5, isPrivate: false },
        { id: 5, name: 'Data Stream', users: 12, isPrivate: false },
        { id: 1, name: 'Shadow Realm', users: 3, isPrivate: true },
        { id: 2, name: 'Digital Abyss', users: 8, isPrivate: false },
        { id: 3, name: 'Neon Void', users: 1, isPrivate: true },
        { id: 4, name: 'Cyber Sanctuary', users: 5, isPrivate: false },
        { id: 5, name: 'Data Stream', users: 12, isPrivate: false },
    ];

    const handleRoomCreated = (roomName: string, password?: string) => {
        console.log('Room created:', roomName, password);
    };

    const handleBack = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <div className={styles.container}>
            {/* Парящие кнопки */}
            <div className={styles.floatingButtons}>
                <button 
                    className={`${styles.floatingBtn} ${styles.backBtn}`}
                    onClick={handleBack}
                >
                    <span className={styles.btnIcon}>←</span>
                </button>

                <button 
                    className={`${styles.floatingBtn} ${styles.newBtn}`}
                    onClick={() => setShowCreateModal(true)}
                >
                    <span className={styles.btnIcon}>+</span>
                </button>

                <button 
                    className={`${styles.floatingBtn} ${styles.listBtn}`}
                    onClick={() => setShowListModal(true)}
                >
                    <span className={styles.btnIcon}>☰</span>
                </button>
            </div>

            {/* Модалки */}
            <CreateRoomModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onRoomCreated={handleRoomCreated}
            />

            <RoomListModal 
                isOpen={showListModal}
                onClose={() => setShowListModal(false)}
                rooms={existingRooms}
            />

            {/* Фоновые элементы */}
            <div className={styles.gridOverlay}></div>
            <div className={styles.cornerGlow}></div>
        </div>
    );
}

export default UserPage;