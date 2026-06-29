'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

// --- Types ---

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number;
}

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

interface MouseState {
  x: number;
  y: number;
  isActive: boolean;
}

const PARTICLE_DENSITY = 0.00015;
const BG_PARTICLE_DENSITY = 0.00005;
const MOUSE_RADIUS = 180;
const RETURN_SPEED = 0.08;
const DAMPING = 0.90;
const REPULSION_STRENGTH = 1.2;

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const ParticleEffectForHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const particlesRef = useRef<Particle[]>([]);
  const backgroundParticlesRef = useRef<BackgroundParticle[]>([]);
  const mouseRef = useRef<MouseState>({ x: -1000, y: -1000, isActive: false });
  const frameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isRunningRef = useRef(true);

  const prefersReducedMotion = usePrefersReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor(width * height * PARTICLE_DENSITY);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      newParticles.push({
        x, y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: randomRange(1, 2.5),
        color: Math.random() > 0.9 ? '#03fa6e' : '#ffffff',
        angle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = newParticles;

    const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY);
    const newBgParticles: BackgroundParticle[] = [];

    for (let i = 0; i < bgCount; i++) {
      newBgParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: randomRange(0.5, 1.5),
        alpha: randomRange(0.1, 0.4),
        phase: Math.random() * Math.PI * 2,
      });
    }
    backgroundParticlesRef.current = newBgParticles;
  }, []);

  const animate = useCallback((time: number) => {
    if (!isRunningRef.current) {
      frameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const logicalWidth = canvas.clientWidth || canvas.width;
    const logicalHeight = canvas.clientHeight || canvas.height;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;
    const pulseSpeed = 0.0008;
    const pulseOpacity = Math.sin(time * pulseSpeed) * 0.035 + 0.085;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(logicalWidth, logicalHeight) * 0.7
    );
    gradient.addColorStop(0, `rgba(3, 250, 110, ${pulseOpacity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    const bgParticles = backgroundParticlesRef.current;
    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < bgParticles.length; i++) {
      const p = bgParticles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = logicalWidth;
      if (p.x > logicalWidth) p.x = 0;
      if (p.y < 0) p.y = logicalHeight;
      if (p.y > logicalHeight) p.y = 0;

      const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5;
      const currentAlpha = p.alpha * (0.3 + 0.7 * twinkle);

      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (mouse.isActive && distance < MOUSE_RADIUS) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

        const repulsion = force * REPULSION_STRENGTH;
        p.vx -= forceDirectionX * repulsion * 5;
        p.vy -= forceDirectionY * repulsion * 5;
      }

      const idleRadius = 15;
      const idleSpeed = 0.001;

      const targetX = p.originX + Math.cos(time * idleSpeed + p.angle) * idleRadius;
      const targetY = p.originY + Math.sin(time * idleSpeed + p.angle) * idleRadius;

      const springDx = targetX - p.x;
      const springDy = targetY - p.y;

      p.vx += springDx * RETURN_SPEED;
      p.vy += springDy * RETURN_SPEED;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.vx *= DAMPING;
      p.vy *= DAMPING;

      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const opacity = Math.min(0.3 + velocity * 0.1, 1);

      ctx.fillStyle = p.color === '#ffffff'
        ? `rgba(255, 255, 255, ${opacity})`
        : p.color;

      ctx.fill();
    }

    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;

        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        initParticles(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    frameIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [animate, prefersReducedMotion]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(([entry]) => {
      isRunningRef.current = entry.isIntersecting;
    }, { threshold: 0 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isActive = false;
  };

  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-hidden bg-[#171810]"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ParticleEffectForHero;
