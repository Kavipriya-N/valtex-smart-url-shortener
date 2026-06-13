import React from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activeTab, setActiveTab, linkCount }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Sidebar">
      {/* Main nav group */}
      <div className="section-label">Main</div>

      <div
        className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
        role="button"
        tabIndex={0}
      >
        <span className="sidebar-icon" aria-hidden="true">⬡</span>
        <span className="sidebar-label">Overview</span>
      </div>

      <div
        className={`sidebar-item ${activeTab === 'links' ? 'active' : ''}`}
        onClick={() => setActiveTab('links')}
        role="button"
        tabIndex={0}
      >
        <span className="sidebar-icon" aria-hidden="true">🔗</span>
        <span className="sidebar-label">My Links</span>
        <span className="sidebar-badge">{linkCount}</span>
      </div>

      <div
        className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => setActiveTab('analytics')}
        role="button"
        tabIndex={0}
      >
        <span className="sidebar-icon" aria-hidden="true">📊</span>
        <span className="sidebar-label">Analytics</span>
      </div>

      <div className="sidebar-divider" />
      <div className="section-label">Account</div>

      <div
        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
        role="button"
        tabIndex={0}
      >
        <span className="sidebar-icon" aria-hidden="true">👤</span>
        <span className="sidebar-label">Profile</span>
      </div>

      {/* Push logout to bottom */}
      <div className="sidebar-spacer" />
      <div className="sidebar-divider" />

      <div
        className="sidebar-item"
        onClick={handleLogout}
        role="button"
        tabIndex={0}
        style={{ color: '#EF4444' }}
      >
        <span className="sidebar-icon" aria-hidden="true">↩</span>
        <span className="sidebar-label">Logout</span>
      </div>
    </aside>
  );
}
