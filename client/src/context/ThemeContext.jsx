import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('valtex_theme');
    if (saved === 'light') { 
      setIsDark(false); 
      document.body.classList.add('theme-light'); 
    }
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      document.body.classList.toggle('theme-light', !next);
      localStorage.setItem('valtex_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
