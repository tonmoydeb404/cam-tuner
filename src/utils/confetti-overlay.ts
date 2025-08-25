import { Logger } from "./log";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
  gravity: number;
  life: number;
  maxLife: number;
}

interface ConfettiConfig {
  confettiType: string;
  colors: string[];
  intensity: number;
  duration: number;
}

/**
 * Confetti Overlay Manager
 * Creates and animates confetti particles on the video stream
 */
export class ConfettiOverlayManager {
  private particles: ConfettiParticle[] = [];
  private startTime = 0;
  private isActive = false;
  private animationId: number | null = null;
  private config: ConfettiConfig;

  constructor(
    config: ConfettiConfig,
    private canvasSize: { width: number; height: number }
  ) {
    this.config = config;
    this.initializeParticles();
  }

  private initializeParticles(): void {
    const particleCount = Math.floor((this.config.intensity / 100) * 150); // 0-150 particles based on intensity
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    Logger.dev(`Initialized ${particleCount} confetti particles for type: ${this.config.confettiType}`);
  }

  private createParticle(): ConfettiParticle {
    const colors = this.config.colors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Different spawn patterns based on confetti type
    let x: number, y: number, vx: number, vy: number;
    
    switch (this.config.confettiType) {
      case 'celebration':
        // Burst from center
        x = this.canvasSize.width * 0.5 + (Math.random() - 0.5) * 100;
        y = this.canvasSize.height * 0.8;
        vx = (Math.random() - 0.5) * 20;
        vy = -Math.random() * 15 - 10;
        break;
        
      case 'hearts':
        // Gentle fall from top
        x = Math.random() * this.canvasSize.width;
        y = -20;
        vx = (Math.random() - 0.5) * 4;
        vy = Math.random() * 3 + 2;
        break;
        
      case 'stars':
        // Scattered from top corners
        x = Math.random() < 0.5 ? -20 : this.canvasSize.width + 20;
        y = Math.random() * this.canvasSize.height * 0.3;
        vx = (Math.random() - 0.5) * 8;
        vy = Math.random() * 5 + 3;
        break;
        
      default: // classic
        // Traditional confetti from top
        x = Math.random() * this.canvasSize.width;
        y = -20;
        vx = (Math.random() - 0.5) * 8;
        vy = Math.random() * 6 + 4;
    }

    const shape = this.getShapeForType(this.config.confettiType);
    const size = Math.random() * 8 + 4; // 4-12px size
    const maxLife = this.config.duration * 60; // Convert seconds to frames (assuming 60fps)

    return {
      x,
      y,
      vx,
      vy,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
      color,
      size,
      shape,
      gravity: 0.3,
      life: maxLife,
      maxLife
    };
  }

  private getShapeForType(type: string): 'square' | 'circle' | 'triangle' {
    switch (type) {
      case 'hearts':
        return 'circle';
      case 'stars':
        return 'triangle';
      case 'celebration':
        return Math.random() < 0.5 ? 'square' : 'triangle';
      default: // classic
        return 'square';
    }
  }

  private updateParticle(particle: ConfettiParticle): boolean {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Apply gravity
    particle.vy += particle.gravity;
    
    // Update rotation
    particle.rotation += particle.rotationSpeed;
    
    // Reduce life
    particle.life--;
    
    // Remove particles that are off-screen or expired
    return particle.life > 0 && 
           particle.x > -50 && 
           particle.x < this.canvasSize.width + 50 &&
           particle.y < this.canvasSize.height + 50;
  }

  private drawParticle(ctx: CanvasRenderingContext2D, particle: ConfettiParticle): void {
    const alpha = Math.min(1, particle.life / (particle.maxLife * 0.2)); // Fade out effect
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = alpha;
    
    const halfSize = particle.size / 2;
    
    switch (particle.shape) {
      case 'square':
        ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size);
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, halfSize);
        ctx.lineTo(-halfSize, halfSize);
        ctx.closePath();
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startTime = performance.now();
    Logger.dev(`Confetti animation started: ${this.config.confettiType}`);
  }

  shouldRender(currentTime: number): boolean {
    if (!this.isActive) return false;
    
    const elapsed = (currentTime - this.startTime) / 1000;
    return elapsed < this.config.duration && this.particles.length > 0;
  }

  render(ctx: CanvasRenderingContext2D, currentTime: number): void {
    if (!this.shouldRender(currentTime)) {
      if (this.isActive && this.particles.length === 0) {
        this.stop();
      }
      return;
    }

    // Update and filter particles
    this.particles = this.particles.filter(particle => {
      const shouldKeep = this.updateParticle(particle);
      if (shouldKeep) {
        this.drawParticle(ctx, particle);
      }
      return shouldKeep;
    });

    // Add new particles occasionally for continuous effect
    if (this.config.confettiType === 'celebration' && Math.random() < 0.3) {
      this.particles.push(this.createParticle());
    }
  }

  stop(): void {
    this.isActive = false;
    this.particles = [];
    Logger.dev(`Confetti animation stopped: ${this.config.confettiType}`);
  }

  cleanup(): void {
    this.stop();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}