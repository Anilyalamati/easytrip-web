import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
}

export const BackgroundMotion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color palette matching luxury obsidian & gold theme
    const colors = [
      'rgba(243, 183, 64, ', // Warm Gold Amber
      'rgba(251, 191, 36, ', // Sunlit Marigold
      'rgba(52, 211, 153, ',  // Forest Emerald
      'rgba(56, 189, 248, ',  // Electric Cyan
      'rgba(247, 213, 110, ', // Champagne Gold
    ];

    // Responsive particle count
    const particleCount = Math.min(Math.floor((width * height) / 13000), 90);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.35,
        alpha: Math.random() * 0.5 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Cursor tracking for gentle kinetic interaction
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 160 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const maxConnectionDistance = 125;

    // Animation Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing connecting lines first
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const lineAlpha = (1 - dist / maxConnectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(243, 183, 64, ${lineAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // 2. Draw glowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 1.2;
          p.x -= (dxMouse / distMouse) * force * 2.2;
          p.y -= (dyMouse / distMouse) * force * 2.2;
          p.alpha = Math.min(1, p.baseAlpha + 0.45);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.03;
        }

        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Dynamic Ambient Aurora Glow Orbs */}
      <div className="absolute -top-32 -right-32 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#f3b740]/25 via-[#e5a83b]/12 to-transparent blur-[120px] aurora-orb-1 transform-gpu" />
      <div className="absolute top-1/3 -left-44 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-[#10b981]/20 via-[#059669]/10 to-transparent blur-[140px] aurora-orb-2 transform-gpu" />
      <div className="absolute -bottom-48 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-[#f7d56e]/20 via-[#f3b740]/10 to-transparent blur-[130px] aurora-orb-3 transform-gpu" />

      {/* Cyber-Cartography Subtle Geometric Latitude/Longitude Grid */}
      <div 
        className="absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f3b740 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(ellipse 90% 75% at 50% 35%, black 45%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 35%, black 45%, transparent 90%)',
        }}
      />

      {/* Ambient Horizon Scan Wave Beam */}
      <div 
        className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#f3b740]/60 to-transparent horizon-beam-sweep"
        style={{
          boxShadow: '0 0 35px 4px rgba(243, 183, 64, 0.4)',
        }}
      />

      {/* Interactive Starlight & Transit Nodes Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
