import { useState, useEffect } from 'react';
import styles from '../styles/LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Имитация запроса
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Login attempt:', { username, password, rememberMe });
        setIsLoading(false);
        // Здесь будет логика входа
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button 
                    className={styles.closeButton} 
                    onClick={handleCloseClick}
                    aria-label="Закрыть"
                >
                    ×
                </button>
                
                <div className={styles.modalHeader}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoIcon}>🔐</div>
                    </div>
                    <h2 className={styles.title}>Авторизация</h2>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Имя пользователя
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder="Введите ваш логин"
                                required
                                disabled={isLoading}
                            />
                            <span className={styles.inputIcon}>👤</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Пароль
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Введите ваш пароль"
                                required
                                disabled={isLoading}
                            />
                            <span className={styles.inputIcon}>🔒</span>
                        </div>
                    </div>

                    <div className={styles.options}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={styles.checkbox}
                                disabled={isLoading}
                            />
                            <span className={styles.checkmark}></span>
                            Запомнить меня
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className={styles.spinner}></div>
                                Вход в систему...
                            </>
                        ) : (
                            'Войти'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;