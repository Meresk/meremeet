import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          number: {
            value: 88,
            density: {
              enable: true,
              area: 666,
            },
          },
          opacity: {
            value: { min: 0.02, max: 0.3 },
            animation: {
              enable: true,
              speed: 0.5,
              sync: false,
            }
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            }
          },
          twinkle: {
            particles: {
              enable: true,
              color: '#ffffff',
              frequency: 0.05,
              opacity: 1,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'connect',
            },
          },
          modes: {
            connect: {
              distance: 100,
              links: {
                opacity: 0.1,
              },
              radius: 150,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;