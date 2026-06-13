export function applyTilt(element, maxDeg = 8) {
  if (!element) return;
  
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * maxDeg;
    const ry = -((e.clientX - cx) / (rect.width / 2)) * maxDeg;
    element.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    
    const shine = element.querySelector('.tilt-shine');
    if (shine) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    element.style.transform = '';
    const shine = element.querySelector('.tilt-shine');
    if (shine) {
      shine.style.background = '';
    }
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}
