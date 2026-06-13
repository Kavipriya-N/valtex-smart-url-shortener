export function burstConfetti(x, y) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:9999;
  `;
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#7C3AED','#06B6D4','#EC4899','#10B981','#F59E0B','#F8FAFF'];
  const pieces = Array.from({ length: 40 }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.8) * 14,
    w: Math.random() * 8 + 4,
    h: Math.random() * 5 + 3,
    rot: Math.random() * 360,
    rSpeed: (Math.random() - 0.5) * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    gravity: 0.4,
    life: 1,
    decay: Math.random() * 0.015 + 0.01,
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.rSpeed;
      p.life -= p.decay;
      if (p.life <= 0) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (pieces.some(p => p.life > 0)) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}
