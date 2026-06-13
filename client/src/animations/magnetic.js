export function applyMagnetic(element, strength = 0.3, threshold = 60) {
  if (!element) return;

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < threshold) {
      element.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    } else {
      element.style.transform = '';
    }
  };

  const handleMouseLeave = () => {
    element.style.transform = '';
  };

  element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
  window.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}
