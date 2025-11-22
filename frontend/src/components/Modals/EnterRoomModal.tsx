import { useState, useEffect } from 'react';
import styles from '../../styles/modals/EnterRoomModal.module.css';
import { useNavigate } from 'react-router-dom';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomEnter: (roomId: string) => void;
}

const RoomModal = ({ isOpen, onClose }: RoomModalProps) => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [roomError, setRoomError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setRoomError('');
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!roomName) {
            setRoomError('Название комнаты обязательно');
            return;
        }
        setRoomError('');
        navigate(`/room/${roomName.trim()}`)
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div 
            className={`${styles.overlay} ${isOpen ? styles.overlayOpen : styles.overlayClosed}`}
            onClick={handleOverlayClick}
        >
            <div className={`${styles.modal} ${isOpen ? styles.modalOpen : styles.modalClosed}`}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                <h2 className={styles.title}>.mere-room</h2>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            id="roomName"
                            type="text"
                            value={roomName}
                            onChange={(e) => {
                                setRoomName(e.target.value);
                                if (roomError) setRoomError('');
                            }}
                            className={`${styles.input} ${roomError ? styles.inputError : ''}`}
                            placeholder="room"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="password"
                        />
                    </div>
                    
                    <button type="submit" className={styles.submitButton}>
                        proceed
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomModal;