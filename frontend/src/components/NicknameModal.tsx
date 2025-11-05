import { useState, useEffect } from 'react'
import styles from '../styles/NicknameModal.module.css'

interface NicknameModalProps {
    isOpen: boolean
    onClose: () => void
    onUserEnter: (userName: string) => void
    roomName: string
}

const NicknameModal = ({ isOpen, onClose, onUserEnter, roomName }: NicknameModalProps) => {
    const [userName, setUserName] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [userError, setUserError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        } else {
            setUserError('')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!userName.trim()) {
            setUserError('Имя пользователя обязательно')
            return
        }

        setUserError('')
        setIsLoading(true)

        try {
            await onUserEnter(userName.trim())
        } catch (error) {
            console.error('Error in form submission:', error)
            setIsLoading(false)
        }
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isVisible) return null

    return (
        <div 
            className={`${styles.overlay} ${isOpen ? styles.overlayOpen : styles.overlayClosed}`}
            onClick={handleOverlayClick}
        >
            <div className={`${styles.modal} ${isOpen ? styles.modalOpen : styles.modalClosed}`}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                <h2 className={styles.title}>Вход в комнату</h2>
                <p className={styles.subtitle}>Комната: <strong>{roomName}</strong></p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value)
                                if (userError) setUserError('')
                            }}
                            className={`${styles.input} ${userError ? styles.inputError : ''}`}
                            placeholder="name"
                            autoFocus
                            disabled={isLoading}
                        />
                        {userError && <span className={styles.errorText}>{userError}</span>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'going...' : 'go'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NicknameModal