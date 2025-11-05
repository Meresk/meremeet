import CanvasBackground from './CanvasBackground';
import ParticlesBackground from './ParticlesBackground';

export const DefaultBackground = () => (
  <>
    <CanvasBackground />
    <ParticlesBackground />
  </>
);

export const DarkBackground = () => (
  <>
    <CanvasBackground 
      darkMode={true}
      colors={{ start: '#000000', end: '#0a0a0a' }}
    />
    <ParticlesBackground 
      colors={['#ff6b6b', '#700f0f', '#771111', '#9f2222']}
      particleCount={150}
      speed={0.1}
    />
  </>
);