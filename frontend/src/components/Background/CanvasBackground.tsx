import { useRef, useEffect } from 'react';

interface CanvasBackgroundProps {
  colors?: {
    start: string;
    end: string;
  };
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal';
  darkMode?: boolean;
}

const CanvasBackground = ({
  colors = {
    start: '#0a0f14',
    end: '#1a252f'
  },
  gradientDirection = 'diagonal',
  darkMode = false
}: CanvasBackgroundProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Темная цветовая схема для NotFound
  const darkColors = {
    start: '#05080a',
    end: '#0f161e'
  };

  // Используем темные цвета если включен darkMode или переданы кастомные цвета
  const finalColors = darkMode ? darkColors : colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      let gradient;
      
      switch (gradientDirection) {
        case 'horizontal':
          gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          break;
        case 'vertical':
          gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          break;
        case 'diagonal':
        default:
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          break;
      }
      
      gradient.addColorStop(0, finalColors.start);
      gradient.addColorStop(1, finalColors.end);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    draw();

    const handleResize = () => {
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [finalColors.start, finalColors.end, gradientDirection]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default CanvasBackground;