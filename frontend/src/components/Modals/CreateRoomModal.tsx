import { useState } from 'react';
import styles from '../../styles/CreateRoomModal.module.css';
import { roomService } from '../../services/room/roomService';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomCreated: (roomName: string, password?: string) => void;
}

function CreateRoomModal({ isOpen, onClose, onRoomCreated }: CreateRoomModalProps) {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;

        setIsCreating(true);
        

        try {
            const createdRoom = await roomService.createRoom(roomName.trim());

            onRoomCreated(createdRoom.name, password || undefined);
            
            setRoomName('');
            setPassword('');
            onClose();
            
        } catch (error) {
            console.error('Failed to create room:', error);
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : styles.overlayClosed}`}>
            <div className={`${styles.modal} ${isOpen ? styles.modalOpen : styles.modalClosed}`}>
                <button 
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>

                <h2 className={styles.title}>.mere-make</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="name"
                            className={styles.input}
                            required
                            disabled={isCreating}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className={styles.input}
                            disabled={isCreating}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isCreating || !roomName.trim()}
                    >
                        {isCreating ? 'doing...' : 'do'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;