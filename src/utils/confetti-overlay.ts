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
  shape: "square" | "circle" | "triangle";
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
    // Optimized particle count for single burst performance
    const baseParticles = 30;
    const intensityBonus = Math.floor((this.config.intensity / 100) * 30);
    const particleCount = Math.min(baseParticles + intensityBonus, 60); // Good balance for single burst

    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    Logger.dev(
      `Initialized ${particleCount} confetti particles for type: ${this.config.confettiType}`
    );
  }

  private createParticle(): ConfettiParticle {
    const colors = this.config.colors;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Different spawn patterns based on confetti type
    let x: number, y: number, vx: number, vy: number;

    switch (this.config.confettiType) {
      case "celebration":
        // Burst from center
        x = this.canvasSize.width * 0.5 + (Math.random() - 0.5) * 100;
        y = this.canvasSize.height * 0.8;
        vx = (Math.random() - 0.5) * 20;
        vy = -Math.random() * 15 - 10;
        break;

      case "hearts":
        // Gentle fall from top
        x = Math.random() * this.canvasSize.width;
        y = -20;
        vx = (Math.random() - 0.5) * 4;
        vy = Math.random() * 3 + 2;
        break;

      case "stars":
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
    const size = Math.random() * 12 + 8; // 8-20px size
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
      maxLife,
    };
  }

  private getShapeForType(type: string): "square" | "circle" | "triangle" {
    switch (type) {
      case "hearts":
        return "circle";
      case "stars":
        return "triangle";
      case "celebration":
        return Math.random() < 0.5 ? "square" : "triangle";
      default: // classic
        return "square";
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
    return (
      particle.life > 0 &&
      particle.x > -50 &&
      particle.x < this.canvasSize.width + 50 &&
      particle.y < this.canvasSize.height + 50
    );
  }

  private drawParticleShape(
    ctx: CanvasRenderingContext2D,
    particle: ConfettiParticle
  ): void {
    const halfSize = particle.size / 2;

    switch (particle.shape) {
      case "square":
        // Simple rectangle - fastest to render
        ctx.fillRect(
          particle.x - halfSize,
          particle.y - halfSize,
          particle.size,
          particle.size
        );
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, halfSize, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "triangle":
        // Simplified triangle drawing without rotation for performance
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y - halfSize);
        ctx.lineTo(particle.x + halfSize, particle.y + halfSize);
        ctx.lineTo(particle.x - halfSize, particle.y + halfSize);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.startTime = performance.now();
    Logger.dev(`Confetti animation started: ${this.config.confettiType}`);
  }

  shouldRender(currentTime: number): boolean {
    if (!this.isActive) return false;

    // Render for duration or while particles exist
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

    // Batch particle operations for better performance
    const particlesToKeep: ConfettiParticle[] = [];
    const particlesToDraw: ConfettiParticle[] = [];

    // Update all particles first
    for (const particle of this.particles) {
      if (this.updateParticle(particle)) {
        particlesToKeep.push(particle);
        particlesToDraw.push(particle);
      }
    }

    this.particles = particlesToKeep;

    // Batch rendering with minimal context state changes
    ctx.save();

    // Group particles by color to reduce fillStyle changes
    const particlesByColor = new Map<string, ConfettiParticle[]>();
    for (const particle of particlesToDraw) {
      const particles = particlesByColor.get(particle.color) || [];
      particles.push(particle);
      particlesByColor.set(particle.color, particles);
    }

    // Render particles grouped by color
    for (const [color, particles] of particlesByColor) {
      ctx.fillStyle = color;
      for (const particle of particles) {
        const alpha = Math.min(1, particle.life / (particle.maxLife * 0.2));
        if (alpha > 0.01) {
          ctx.globalAlpha = alpha;
          this.drawParticleShape(ctx, particle);
        }
      }
    }

    ctx.restore();

    // Add new particles occasionally for celebration type
    if (this.config.confettiType === "celebration" && Math.random() < 0.2) {
      this.particles.push(this.createParticle());
    }
  }

  stop(): void {
    this.isActive = false;
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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
