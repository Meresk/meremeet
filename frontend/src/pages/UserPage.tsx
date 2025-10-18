import { useState } from 'react';
import styles from '../styles/UserPage.module.css';

function UserPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const existingRooms = [
        { id: 1, name: 'Shadow Realm', users: 3, isPrivate: true },
        { id: 2, name: 'Digital Abyss', users: 8, isPrivate: false },
        { id: 3, name: 'Neon Void', users: 1, isPrivate: true },
        { id: 4, name: 'Cyber Sanctuary', users: 5, isPrivate: false },
        { id: 5, name: 'Data Stream', users: 12, isPrivate: false },
    ];

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setTimeout(() => {
            setIsCreating(false);
            setRoomName('');
            setPassword('');
            setShowCreateModal(false);
        }, 1500);
    };

    const handleBack = () => {
        window.location.href = '/';
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

            {/* Модалка создания комнаты */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>СОЗДАТЬ КОМНАТУ</h2>
                            <button 
                                className={styles.closeBtn}
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateRoom} className={styles.modalForm}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder=" "
                                    className={styles.inputField}
                                    required
                                />
                                <label className={styles.inputLabel}>НАЗВАНИЕ КОМНАТЫ</label>
                                <div className={styles.inputLine}></div>
                            </div>
                            
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder=" "
                                    className={styles.inputField}
                                />
                                <label className={styles.inputLabel}>ПАРОЛЬ (ОПЦИОНАЛЬНО)</label>
                                <div className={styles.inputLine}></div>
                            </div>

                            <button 
                                type="submit" 
                                className={`${styles.createBtn} ${isCreating ? styles.creating : ''}`}
                                disabled={isCreating || !roomName.trim()}
                            >
                                <span className={styles.btnText}>
                                    {isCreating ? 'СОЗДАЁМ...' : 'СОЗДАТЬ КОМНАТУ'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Модалка списка комнат */}
            {showListModal && (
                <div className={styles.modalOverlay} onClick={() => setShowListModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>СПИСОК КОМНАТ</h2>
                            <div className={styles.roomsCount}>{existingRooms.length}</div>
                            <button 
                                className={styles.closeBtn}
                                onClick={() => setShowListModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.roomsList}>
                            {existingRooms.map(room => (
                                <div 
                                    key={room.id} 
                                    className={`${styles.roomItem} ${room.isPrivate ? styles.private : ''}`}
                                >
                                    <div className={styles.roomInfo}>
                                        <span className={styles.roomName}>{room.name}</span>
                                        {room.isPrivate && <div className={styles.lockIcon}>⌖</div>}
                                    </div>
                                    <div className={styles.roomUsers}>
                                        {room.users} <span className={styles.usersText}>👥</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Фоновые элементы */}
            <div className={styles.gridOverlay}></div>
            <div className={styles.cornerGlow}></div>
        </div>
    );
}

export default UserPage;