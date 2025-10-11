import Logo from './assets/mm-b-1.svg';
import styles from './App.module.css';
import ParticlesBackground from './components/ParticlesBackground';
import CanvasBackground from './components/CanvasBackground';

function App() {
    return (
        <div className={styles.app}>
            {/* Canvas background*/}
            <CanvasBackground />
            { /* Particles */}
            <ParticlesBackground />

            { /* LOGO */ }
            <div className={styles.logoContainer}>
                <img src={Logo} alt="Logo" className={styles.logo}/>
            </div>

            { /* Creator text */ }
            <div className={styles.creatortxt}>
                by. meresk.
            </div>
        </div>
    )
}

export default App;