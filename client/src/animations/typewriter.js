export function startTypewriter(element, phrases, options = {}) {
  if (!element) return;
  const { typeSpeed = 50, deleteSpeed = 30, pauseMs = 2500 } = options;
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  let timeoutId = null;

  function tick() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      element.textContent = current.slice(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeoutId = setTimeout(tick, 400);
        return;
      }
      timeoutId = setTimeout(tick, deleteSpeed);
    } else {
      element.textContent = current.slice(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        timeoutId = setTimeout(tick, pauseMs);
        return;
      }
      timeoutId = setTimeout(tick, typeSpeed);
    }
  }
  tick();

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}
