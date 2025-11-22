import { useNavigate } from 'react-router-dom';
import Logo from '../assets/nf.svg';
import styles from '../styles/pages/NotFoundPage.module.css';

function NotFound() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className={styles.app}>
            <div 
                className={styles.logoContainer} 
                onClick={handleLogoClick}
                style={{cursor: 'pointer'}}
            >
                <img src={Logo} alt="Logo" className={styles.logo}/>
            </div>
        </div>
    );
}

export default NotFound;