import { useState, useEffect } from 'react';
import styles from '../styles/RoomModal.module.css';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RoomModal = ({ isOpen, onClose }: RoomModalProps) => {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Room:', roomName, 'Password:', password);
        // Здесь логика входа в комнату
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
                
                <h2 className={styles.title}>Вход в комнату</h2>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="roomName" className={styles.label}>
                            Название комнаты
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className={styles.input}
                            placeholder="Введите название комнаты"
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Пароль (опционально)
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Введите пароль"
                        />
                    </div>
                    
                    <button type="submit" className={styles.submitButton}>
                        Присоединиться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomModal;