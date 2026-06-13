export function animateCounter(element, target, duration = 1200) {
  if (!element) return;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const value = Math.round(ease * target);
    element.textContent = isFloat
      ? (ease * target).toFixed(1)
      : value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
