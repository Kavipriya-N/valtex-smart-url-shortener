import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="logo" onClick={() => navigate('/')}>
        <div className="logo-icon-wrap">
          <div className="logo-icon-bg">
            <svg
              className="logo-mark"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 16 L10 3 L17 16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 12 L13.5 12"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="10.5" r="1.5" fill="white" />
            </svg>
          </div>
          <div className="logo-ring" aria-hidden="true" />
          <div className="logo-dot" aria-hidden="true" />
        </div>

        <div className="logo-text-wrap">
          <span className="logo-name">VΛLTEX</span>
          <span className="logo-tagline">Links at warp speed</span>
        </div>
      </div>

      <div className="nav-right">
        <ThemeToggle />
        {user && (
          <>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="nav-avatar">
                {getInitials(user.name)}
              </div>
            </Link>
            <button className="nbtn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
