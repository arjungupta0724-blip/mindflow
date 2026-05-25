import React, { useEffect, useRef } from 'react';

/**
 * Celebration - Fullscreen HTML5 Canvas Confetti Engine.
 * Simulates micro-gravity, air drag, sway, and rotation to reward accomplishments.
 */
export default function Celebration({ active, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class definition
    class ConfettiParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height - 20; // Start offscreen
        this.size = Math.random() * 8 + 6;
        this.width = this.size;
        this.height = this.size * (Math.random() * 0.4 + 0.8);
        
        // Dynamic pastel & neon colors matching our themes
        const colors = [
          '#4facfe', '#00f2fe', '#ff007f', '#ffe600', 
          '#00ffc4', '#cba6d6', '#9a8cc4', '#81c784'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Realistic physics properties
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 4 + 4;
        this.gravity = 0.15;
        this.drag = 0.98;
        
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
        this.sway = Math.random() * 2 * Math.PI;
        this.swaySpeed = Math.random() * 0.05 + 0.02;
      }

      update() {
        this.speedY += this.gravity;
        this.speedX *= this.drag;
        this.speedY *= this.drag;
        
        this.x += this.speedX + Math.sin(this.sway) * 0.5;
        this.y += this.speedY;
        this.sway += this.swaySpeed;
        
        this.rotation += this.rotationSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
    }

    // Spawn initial particle burst
    const particles = Array.from({ length: 130 }, () => new ConfettiParticle());
    let framesElapsed = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let particlesRunning = false;

      particles.forEach((p) => {
        p.update();
        p.draw();
        if (p.y < canvas.height + 20) {
          particlesRunning = true;
        }
      });

      framesElapsed += 1;

      // Finish celebration after particles fall offscreen or 3.5 seconds pass
      if (particlesRunning && framesElapsed < 210) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    />
  );
}
