import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import api from '../api/axios';
import { User, ShieldCheck, Mail, Loader2, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name) return;
    setUpdatingInfo(true);

    try {
      const res = await api.put('/auth/profile', {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      if (res.data.success) {
        toast.success('Profile updated successfully!');
        const updatedUser = { ...user, name: res.data.user.name };
        localStorage.setItem('valtex_user', JSON.stringify(updatedUser));
        setCurrentPassword('');
        setNewPassword('');
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdatingInfo(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="dash-layout">
        <Sidebar activeTab="profile" setActiveTab={(tab) => navigate(`/dashboard?tab=${tab}`)} />

        <main className="dash-main animate-fade">
          <div className="page-header">
            <h1>My Profile</h1>
            <p>Update your personal account credentials and security.</p>
          </div>

          <div className="profile-grid">
            <div className="profile-info-card card glass">
              <div className="profile-avatar-large">
                {getInitials(user?.name)}
              </div>
              <h3 className="profile-user-name">{user?.name}</h3>
              <span className="profile-user-role grd">SaaS Member</span>

              <div className="divider"></div>

              <div className="profile-meta-rows">
                <div className="meta-row">
                  <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                  <span>{user?.email}</span>
                </div>
                <div className="meta-row">
                  <ShieldCheck size={16} style={{ color: 'var(--accent-4)' }} />
                  <span>Account Verified</span>
                </div>
              </div>
            </div>

            <div className="profile-form-card card glass">
              <h3 className="card-subtitle font-display">Account Information</h3>
              <form onSubmit={handleUpdateProfile} className="profile-form" noValidate>
                <div className="fg">
                  <label htmlFor="name-input">Display Name</label>
                  <div className="input-wrapper">
                    <input
                      id="name-input"
                      type="text"
                      className="fi"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="fg">
                  <label htmlFor="email-input">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      id="email-input"
                      type="email"
                      className="fi"
                      value={email}
                      disabled
                      autoComplete="email"
                    />
                  </div>
                  <span className="fi-hint">Changing email is not supported for security reasons.</span>
                </div>

                <div className="divider"></div>

                <h3 className="card-subtitle font-display" style={{ marginTop: '8px' }}>Update Password (Optional)</h3>

                <div className="fg">
                  <label htmlFor="current-pass-input">Current Password</label>
                  <div className="input-wrapper">
                    <input
                      id="current-pass-input"
                      type={showCurrentPass ? 'text' : 'password'}
                      className="fi"
                      placeholder="Leave blank if not changing"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="input-eye-btn"
                      onClick={() => setShowCurrentPass(p => !p)}
                      aria-label={showCurrentPass ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPass ? '👁' : '🔒'}
                    </button>
                  </div>
                </div>

                <div className="fg">
                  <label htmlFor="new-pass-input">New Password</label>
                  <div className="input-wrapper">
                    <input
                      id="new-pass-input"
                      type={showNewPass ? 'text' : 'password'}
                      className="fi"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-eye-btn"
                      onClick={() => setShowNewPass(p => !p)}
                      aria-label={showNewPass ? 'Hide password' : 'Show password'}
                    >
                      {showNewPass ? '👁' : '🔒'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary save-btn" disabled={updatingInfo}>
                  {updatingInfo ? <Loader2 className="spinner" size={18} /> : 'Save Profile Details'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-base);
        }
        .profile-main {
          display: flex;
          flex: 1;
        }
        .profile-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .profile-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-title {
          font-family: var(--ff);
          font-size: 32px;
          font-weight: 700;
        }
        .profile-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
          align-items: flex-start;
        }
        
        .profile-info-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 32px !important;
        }
        .profile-avatar-large {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--grad-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ff);
          font-weight: 700;
          font-size: 32px;
          border: 2px solid var(--border-strong);
          margin-bottom: 24px;
          box-shadow: var(--glow-violet);
        }
        .profile-user-name {
          font-family: var(--ff);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .profile-user-role {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .divider {
          width: 100%;
          height: 1px;
          background: var(--border-subtle);
          margin: 24px 0;
        }
        .profile-meta-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          text-align: left;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .profile-form-card {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .card-subtitle {
          font-family: var(--ff);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .input-with-icon .input-field {
          width: 100%;
          padding-left: 44px;
        }
        .save-btn {
          align-self: flex-start;
          height: 44px;
          font-size: 14px;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade {
          animation: fadeUp 0.5s ease-out;
        }

        @media (max-width: 990px) {
          .profile-main { flex-direction: column; }
          .sidebar { width: 100%; height: auto; border-bottom: 1px solid var(--border-subtle); position: relative; top: 0; padding: 16px; }
          .profile-grid { grid-template-columns: 1fr; }
          .profile-content { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
}
