import { useState, useEffect } from 'react';
import styles from '../../styles/RoomListModal.module.css';
import { roomService } from '../../services/room/roomService';

interface Room {
    name: string;
    participants: number;
    creationTime: number;
}

interface RoomListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function RoomListModal({ isOpen, onClose }: RoomListModalProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchRooms();
        }
    }, [isOpen]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const roomsData = await roomService.getAllRooms();
            setRooms(roomsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load rooms');
            console.error('Failed to fetch rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCreationTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

                <div className={styles.header}>
                    <div className={styles.roomsCount}>
                        {loading ? '...' : rooms.length}
                    </div>
                    <h2 className={styles.title}>.mere-list</h2>
                </div>

                {loading && (
                    <div className={styles.loading}>
                        Loading rooms...
                    </div>
                )}

                {error && (
                    <div className={styles.error}>
                        <div>{error}</div>
                        <button 
                            onClick={fetchRooms} 
                            className={styles.retryButton}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className={styles.roomsList}>
                        {(
                            rooms.map(room => (
                                <div 
                                    key={room.name} 
                                    className={`${styles.roomItem}`}
                                >
                                    <div className={styles.roomInfo}>
                                        <span className={styles.roomName}>{room.name}</span>
                                        <div className={styles.roomMeta}>
                                            Created: {formatCreationTime(room.creationTime)}
                                        </div>
                                    </div>
                                    <div className={styles.roomUsers}>
                                        {room.participants}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoomListModal;