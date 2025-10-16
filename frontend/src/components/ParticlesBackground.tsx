import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

interface ParticlesBackgroundProps {
  colors?: string[];
  particleCount?: number;
  speed?: number;
  opacity?: { min: number; max: number };
  size?: { min: number; max: number };
  twinkle?: boolean;
  interactivity?: boolean;
}

const ParticlesBackground = ({
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  particleCount = 88,
  speed = 0.2,
  opacity = { min: 0.02, max: 0.3 },
  size = { min: 1, max: 5 },
  twinkle = true,
  interactivity = true
}: ParticlesBackgroundProps) => {
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
            value: colors,
          },
          move: {
            enable: true,
            speed: speed,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          number: {
            value: particleCount,
            density: {
              enable: true,
              area: 666,
            },
          },
          opacity: {
            value: opacity,
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
            value: size,
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            }
          },
          twinkle: twinkle ? {
            particles: {
              enable: true,
              color: '#ffffff',
              frequency: 0.05,
              opacity: 1,
            },
          } : undefined,
        },
        interactivity: interactivity ? {
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
        } : undefined,
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;