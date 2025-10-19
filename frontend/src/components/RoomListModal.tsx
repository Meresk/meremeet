import styles from '../styles/RoomListModal.module.css';

interface Room {
    id: number;
    name: string;
    users: number;
    isPrivate: boolean;
}

interface RoomListModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: Room[];
}

function RoomListModal({ isOpen, onClose, rooms }: RoomListModalProps) {
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
                    <div className={styles.roomsCount}>{rooms.length}</div>
                    <h2 className={styles.title}>.mere-list</h2>
                </div>

                <div className={styles.roomsList}>
                    {rooms.map(room => (
                        <div 
                            key={room.id} 
                            className={`${styles.roomItem} ${room.isPrivate ? styles.private : ''}`}
                        >
                            <div className={styles.roomInfo}>
                                <span className={styles.roomName}>{room.name}</span>
                                {room.isPrivate && <div className={styles.lockIcon}>⌖</div>}
                            </div>
                            <div className={styles.roomUsers}>
                                {room.users}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RoomListModal;