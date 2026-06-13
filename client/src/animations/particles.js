export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -999, y: -999 };
    this.raf = null;
    this.colors = [
      'rgba(124,58,237,', 'rgba(6,182,212,',
      'rgba(236,72,153,', 'rgba(16,185,129,'
    ];
    this.resize();
    this.init();
    
    this.resizeHandler = () => this.resize();
    this.mousemoveHandler = (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    };
    this.mouseleaveHandler = () => {
      this.mouse.x = -999; this.mouse.y = -999;
    };

    window.addEventListener('resize', this.resizeHandler);
    canvas.addEventListener('mousemove', this.mousemoveHandler);
    canvas.addEventListener('mouseleave', this.mouseleaveHandler);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      c: this.colors[Math.floor(Math.random() * this.colors.length)],
      o: Math.random() * 0.5 + 0.15,
    }));
  }

  draw() {
    const { ctx, canvas, particles, mouse } = this;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) {
        p.vx -= (dx / dist) * 0.4;
        p.vy -= (dy / dist) * 0.4;
      }
      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.o + ')';
      ctx.fill();
    });
    this.raf = requestAnimationFrame(() => this.draw());
  }

  start() { this.draw(); }
  stop() { 
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.mousemoveHandler);
      this.canvas.removeEventListener('mouseleave', this.mouseleaveHandler);
    }
  }
}
