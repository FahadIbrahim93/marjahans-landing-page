import { useEffect, useRef } from "react";

type LuxuryParticleBackgroundProps = {
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

const MAX_PARTICLES = 80;
const MOBILE_PARTICLES = 45;
const PARTICLE_SPEED = 0.08;

/**
 * Interactive ambient particle field tuned for premium/luxury hero sections.
 * - Mouse parallax response
 * - Subtle connective shimmer lines
 * - Reduced-motion aware
 */
export function LuxuryParticleBackground({ className }: LuxuryParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? MOBILE_PARTICLES : MAX_PARTICLES;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * PARTICLE_SPEED,
          vy: (Math.random() - 0.5) * PARTICLE_SPEED,
          radius: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.45 + 0.2,
        });
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetPointerX = event.clientX;
      targetPointerY = event.clientY;
    };

    const drawGradientFog = () => {
      const radial1 = ctx.createRadialGradient(width * 0.15, height * 0.2, 0, width * 0.15, height * 0.2, width * 0.65);
      radial1.addColorStop(0, "rgba(251, 191, 36, 0.15)");
      radial1.addColorStop(1, "rgba(251, 191, 36, 0)");

      const radial2 = ctx.createRadialGradient(width * 0.85, height * 0.8, 0, width * 0.85, height * 0.8, width * 0.55);
      radial2.addColorStop(0, "rgba(167, 139, 250, 0.09)");
      radial2.addColorStop(1, "rgba(167, 139, 250, 0)");

      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawGradientFog();

      if (!reducedMotion) {
        pointerX += (targetPointerX - pointerX) * 0.045;
        pointerY += (targetPointerY - pointerY) * 0.045;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const offsetX = ((pointerX / Math.max(width, 1)) - 0.5) * 18;
        const offsetY = ((pointerY / Math.max(height, 1)) - 0.5) * 18;

        ctx.beginPath();
        ctx.arc(p.x + offsetX, p.y + offsetY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 236, 179, ${p.alpha})`;
        ctx.fill();
      }

      // connective threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 105) continue;

          const opacity = Math.max(0, (1 - dist / 105) * 0.18);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    targetPointerX = width / 2;
    targetPointerY = height / 2;
    pointerX = targetPointerX;
    pointerY = targetPointerY;

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
