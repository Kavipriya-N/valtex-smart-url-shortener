import { useState, useEffect } from 'react';

export function useCounterUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId = null;
    const isFloat = target % 1 !== 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = ease * target;
      
      setCount(isFloat ? parseFloat(value.toFixed(1)) : Math.round(value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return count;
}

export default useCounterUp;
