import { useNavigate } from 'react-router-dom';
import Logo from '../assets/nf.svg';
import styles from '../styles/NotFound.module.css';
import CanvasBackground from '../components/CanvasBackground';
import ParticlesBackground from '../components/ParticlesBackground';

function NotFound() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className={styles.app}>
            <CanvasBackground darkMode={true} />
            <ParticlesBackground 
                colors={['#ff6b6b', '#700f0fff', '#771111ff', '#9f2222ff']}
                particleCount={150}
                speed={0.1}
            />
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