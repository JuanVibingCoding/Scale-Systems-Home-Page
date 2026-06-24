import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; speed: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 20);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.2 + Math.random() * 0.5,
          size: Math.random() * 2,
          opacity: Math.random() * 0.5
        });
      }
    };

    const draw = () => {
      if (!isRunningRef.current) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(3, 250, 110, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isRunningRef.current = entry.isIntersecting;
    }, { threshold: 0 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="opacity-40 w-full h-full"
      />
    </div>
  );
}
