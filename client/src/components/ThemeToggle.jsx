import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = () => {
    // Add page flash animation behavior
    document.body.style.transition = 'none';
    document.body.style.opacity = '0.95';
    toggle();
    
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease, background 0.5s ease, color 0.4s ease';
      document.body.style.opacity = '1';
    }, 50);
  };

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label="Toggle Theme"
      style={{ position: 'relative', width: '40px', height: '40px', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
          transform: isDark ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.5)',
          opacity: isDark ? 1 : 0,
        }}
      >
        <Moon className="w-5 h-5" style={{ color: 'var(--accent-1)' }} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
          transform: !isDark ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.5)',
          opacity: !isDark ? 1 : 0,
        }}
      >
        <Sun className="w-5 h-5" style={{ color: 'var(--accent-5)' }} />
      </div>
    </button>
  );
}
