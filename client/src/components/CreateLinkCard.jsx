import React, { useState } from 'react';
import api from '../api/axios';
import useToast from '../hooks/useToast';
import { burstConfetti } from '../animations/confetti';
import { Link, Calendar, Hash, Sparkles } from 'lucide-react';

export default function CreateLinkCard({ onUrlCreated }) {
  const toast = useToast();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [floatingBadges, setFloatingBadges] = useState([]);

  const handleCreateRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error('Please enter a destination URL.');
      return;
    }

    setLoading(true);
    // Capture click position for confetti burst
    const btnRect = e.target.querySelector('button[type="submit"]').getBoundingClientRect();
    const burstX = btnRect.left + btnRect.width / 2;
    const burstY = btnRect.top + btnRect.height / 2;

    try {
      const { data } = await api.post('/urls', {
        originalUrl,
        customAlias: customAlias || undefined,
        title: title || undefined,
        expiryDate: expiryDate || undefined,
      });

      if (data.success) {
        toast.success('Link created successfully!');
        
        // 1. Confetti burst
        burstConfetti(burstX, burstY);

        // 2. Trigger floating badge
        const badgeId = Date.now();
        const shortUrlText = data.url.shortUrl;
        setFloatingBadges((prev) => [...prev, { id: badgeId, text: shortUrlText }]);
        setTimeout(() => {
          setFloatingBadges((prev) => prev.filter((b) => b.id !== badgeId));
        }, 1500);

        // Reset inputs
        setOriginalUrl('');
        setCustomAlias('');
        setTitle('');
        setExpiryDate('');

        // Notify parent to refresh
        if (onUrlCreated) {
          onUrlCreated(data.url);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass create-link-card shine-border">
      <div className="card-header">
        <h2 className="grd title-branding">Shorten New URL</h2>
        <p className="subtitle-branding">Paste your long link and customize your alias</p>
      </div>

      <form onSubmit={handleSubmit} className="create-link-form">
        <div className="fg">
          <label htmlFor="newUrl">Destination URL</label>
          <div className="input-wrapper">
            <input
              id="newUrl"
              type="url"
              className="fi"
              placeholder="https://your-long-url.com/path?query=value"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          <span className="advanced-text">
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </span>
          <Sparkles size={14} className={showAdvanced ? 'icon-spin' : ''} style={{ color: 'var(--accent-2)' }} />
        </div>

        {showAdvanced && (
          <div className="advanced-options fade-up">
            <div className="fg">
              <label htmlFor="customTitle">Custom Title <span style={{ color: 'var(--text-muted)' }}>optional</span></label>
              <div className="input-wrapper">
                <input
                  id="customTitle"
                  type="text"
                  className="fi"
                  placeholder="Marketing Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="advanced-row" style={{ display: 'flex', gap: '16px' }}>
              <div className="fg" style={{ flex: 1.5 }}>
                <label htmlFor="newAlias">Custom Alias <span style={{ color: 'var(--text-muted)' }}>optional</span></label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <span className="alias-prefix" style={{
                    position: 'absolute',
                    left: '14px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '14px',
                    pointerEvents: 'none',
                    zIndex: 2,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>vltx.io/</span>
                  <input
                    id="newAlias"
                    type="text"
                    className="fi"
                    style={{ paddingLeft: '70px' }}
                    placeholder="my-brand"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    maxLength={20}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="fg" style={{ flex: 1 }}>
                <label htmlFor="expiryDate">Expiration Date</label>
                <div className="input-wrapper">
                  <input
                    id="expiryDate"
                    type="date"
                    className="fi"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={loading}
          onClick={handleCreateRipple}
        >
          {loading ? 'Creating...' : 'Shorten Link'}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="ripple-span"
              style={{
                left: ripple.x,
                top: ripple.y,
              }}
            />
          ))}
        </button>
      </form>

      {/* Floating badges overlay */}
      {floatingBadges.map((badge) => (
        <div key={badge.id} className="floating-badge shadow-glow">
          ⚡ {badge.text}
        </div>
      ))}

      <style>{`
        .create-link-card {
          margin-bottom: 32px;
          position: relative;
        }
        .title-branding {
          font-family: var(--ff);
          font-weight: 800;
          font-size: 22px;
          margin-bottom: 4px;
        }
        .subtitle-branding {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 24px;
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
        .advanced-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 20px;
          user-select: none;
          transition: var(--transition);
        }
        .advanced-toggle:hover {
          color: var(--text-primary);
        }
        .advanced-options {
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
          margin-bottom: 20px;
        }
        .advanced-row {
          display: flex;
          gap: 16px;
        }
        .flex-1 {
          flex: 1;
        }
        .alias-prefix {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 15px;
        }
        .alias-input {
          padding-left: 72px !important;
        }
        .btn-submit {
          width: 100%;
          height: 48px;
          font-size: 16px;
          position: relative;
          overflow: hidden;
        }
        .ripple-span {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: rippleOut 0.6s linear;
          background: rgba(255, 255, 255, 0.3);
          width: 80px;
          height: 80px;
          margin-left: -40px;
          margin-top: -40px;
          pointer-events: none;
        }
        .floating-badge {
          position: absolute;
          top: -20px;
          right: 24px;
          background: var(--bg-surface);
          border: 1.5px solid var(--accent-2);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 100px;
          font-family: var(--fm);
          font-weight: 500;
          font-size: 13px;
          z-index: 10;
          animation: floatBadge 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          pointer-events: none;
        }
        @keyframes rippleOut {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .icon-spin {
          animation: logoMorph 4s infinite linear;
        }
      `}</style>
    </div>
  );
}
