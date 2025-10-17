import { useState } from 'react';
import styles from '../styles/UserPage.module.css';

function UserPage() {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Заглушка для списка комнат
    const existingRooms = [
        { id: 1, name: 'Shadow Realm', users: 3, isPrivate: true },
        { id: 2, name: 'Digital Abyss', users: 8, isPrivate: false },
        { id: 3, name: 'Neon Void', users: 1, isPrivate: true },
        { id: 4, name: 'Cyber Sanctuary', users: 5, isPrivate: false },
        { id: 5, name: 'Data Stream', users: 12, isPrivate: false },
        { id: 6, name: 'Encrypted', users: 2, isPrivate: true },
    ];

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        // Заглушка
        setTimeout(() => {
            setIsCreating(false);
            setRoomName('');
            setPassword('');
        }, 1500);
    };

    return (
        <div className={styles.container}>
            {/* Панель создания комнаты */}
            <div className={styles.creationPanel}>
                <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>НОВАЯ КОМНАТА</div>
                    <div className={styles.panelSubtitle}>создай пространство</div>
                </div>
                
                <form onSubmit={handleCreateRoom} className={styles.creationForm}>
                    <div className={styles.inputContainer}>
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
                            <label className={styles.inputLabel}>ПАРОЛЬ</label>
                            <div className={styles.inputLine}></div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`${styles.createBtn} ${isCreating ? styles.creating : ''}`}
                        disabled={isCreating || !roomName.trim()}
                    >
                        <span className={styles.btnText}>
                            {isCreating ? 'СОЗДАЁМ...' : 'СОЗДАТЬ'}
                        </span>
                        <div className={styles.btnParticles}></div>
                        <div className={styles.btnGlow}></div>
                    </button>
                </form>
            </div>

            {/* Список комнат */}
            <div className={styles.roomsPanel}>
                <div className={styles.roomsHeader}>
                    <div className={styles.roomsTitle}>СУЩЕСТВУЮЩИЕ КОМНАТЫ</div>
                    <div className={styles.roomsCount}>{existingRooms.length}</div>
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
                            <div className={styles.roomUsers}>{room.users}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Декоративные элементы */}
            <div className={styles.cornerAccent}></div>
            <div className={styles.gridOverlay}></div>
        </div>
    );
}

export default UserPage;