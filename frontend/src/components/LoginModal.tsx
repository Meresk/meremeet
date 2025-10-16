import { useState, useEffect } from 'react';
import styles from '../styles/LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userId: string) => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setLoginError('');
            setPasswordError('');
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            setLoginError('логин обязателен');
            return;
        }
        setLoginError('');
        if (!password) {
            setPasswordError('пароль обязателен');
            return;
        } 
        setPasswordError('');
        console.log('Username:', username, 'Password:', password);
        // Здесь логика авторизации
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
                
                <h2 className={styles.title}>{'.mere-in'}</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                if (loginError) setLoginError('');
                            }}
                            className={`${styles.input} ${loginError ? styles.inputError : ''}`}
                            placeholder="login"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (loginError) setPasswordError('');
                            }}
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            placeholder="password"
                        />
                    </div>
                    
                    <button type="submit" className={styles.submitButton}>
                        go
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;