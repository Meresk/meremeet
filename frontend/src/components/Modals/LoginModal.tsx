import { useState, useEffect } from 'react';
import styles from '../../styles/modals/LoginModal.module.css';
import { authService } from '../../services/auth/authService';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setLoginError('');
            setPasswordError('');
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
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

        setIsLoading(true);

        try {
            await authService.login({login: username, password});
            onLoginSuccess();
            
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
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
                    
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'going...' : 'go'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;