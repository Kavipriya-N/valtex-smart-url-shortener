import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card card glass shine-border animate-fade">
        <div className="icon-box">
          <ShieldAlert size={40} style={{ color: 'var(--accent-3)' }} />
        </div>
        <h1 className="font-display grd">404</h1>
        <h2>Page Not Found</h2>
        <p>The link you requested may have been deleted, moved, or never existed in the first place.</p>
        <Link to="/" className="btn btn-primary back-home-btn">
          <ArrowLeft size={18} />
          <span>Return Home</span>
        </Link>
      </div>

      <style>{`
        .notfound-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-base);
          padding: 24px;
        }
        .notfound-card {
          width: 100%;
          max-width: 440px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 32px !important;
        }
        .icon-box {
          background: rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.2);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .notfound-card h1 {
          font-family: var(--ff);
          font-size: 80px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }
        .notfound-card h2 {
          font-family: var(--ff);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .notfound-card p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 32px;
        }
        .back-home-btn {
          height: 44px;
          font-size: 15px;
        }
        .animate-fade {
          animation: fadeUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
