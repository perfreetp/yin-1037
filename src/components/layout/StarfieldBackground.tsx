import { useEffect, useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export const StarfieldBackground = () => {
  const stars = useMemo<Star[]>(() => {
    const result: Star[] = [];
    for (let i = 0; i < 150; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 20 + 10
      });
    }
    return result;
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top, #1a1f4e 0%, #0a1628 40%, #050a14 100%)'
        }}
      />
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.speed}s ease-in-out infinite, float ${star.speed * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * star.speed}s`,
            boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(255,255,255,0.5)` : 'none'
          }}
        />
      ))}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #5b4b8a 0%, transparent 70%)',
          top: '10%',
          right: '-10%',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #4cc9f0 0%, transparent 70%)',
          bottom: '20%',
          left: '-5%',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
    </div>
  );
};
