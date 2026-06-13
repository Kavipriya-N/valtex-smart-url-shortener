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
    <nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        {/* ── VΛLTEX Premium Logo ── */}
        <div className="logo" onClick={() => navigate('/')} role="banner">
          <div className="logo-icon-wrap">
            {/* Animated gradient icon */}
            <div className="logo-icon-bg">
              {/* Custom SVG logo mark — lightning bolt in lambda shape */}
              <svg
                className="logo-mark"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Λ shape with lightning bolt */}
                <path
                  d="M3 16 L10 3 L17 16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.9"
                />
                <path
                  d="M6.5 12 L13.5 12"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
                {/* Inner accent dot */}
                <circle cx="10" cy="10.5" r="1.5" fill="white" fillOpacity="0.85"/>
              </svg>
            </div>
            {/* Ring on hover */}
            <div className="logo-ring" aria-hidden="true"/>
            {/* Live pulse dot */}
            <div className="logo-dot" aria-hidden="true"/>
          </div>

          <div className="logo-text-wrap">
            <span className="logo-name">
              V<span style={{ fontStyle: 'normal' }}>Λ</span>LTEX
            </span>
            <span className="logo-tagline">Links at warp speed</span>
          </div>
        </div>

        <div className="nav-actions-section">
          <ThemeToggle />
          
          {user && (
            <div className="nav-user-section">
              <Link to="/profile" className="profile-link">
                <div className="avatar">
                  {getInitials(user.name)}
                </div>
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout} title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background: var(--bg-layer2);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 24px;
          height: 64px;
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ff);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .logo-sparkle {
          font-size: 18px;
          line-height: 1;
        }
        .logo-lambda {
          color: var(--accent-1);
        }
        .nav-actions-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-user-section {
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 1px solid var(--border-subtle);
          padding-left: 16px;
        }
        .profile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .profile-link:hover {
          background: var(--bg-hover);
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--grad-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid var(--border-strong);
        }
        .user-name {
          font-weight: 500;
          font-size: 14px;
          color: var(--text-primary);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          transition: var(--transition);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }
      `}</style>
    </nav>
  );
}
