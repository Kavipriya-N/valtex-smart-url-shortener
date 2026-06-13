import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Zap, BarChart3, Fingerprint, Calendar, ShieldCheck, QrCode, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { ParticleSystem } from '../animations/particles';
import { startTypewriter } from '../animations/typewriter';
import { applyTilt } from '../animations/tilt';
import { applyMagnetic } from '../animations/magnetic';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const [urlInput, setUrlInput] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const typewriterRef = useRef(null);
  const navbarRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const demoBtnRef = useRef(null);
  const featureCardsRef = useRef([]);

  useEffect(() => {
    // 1. Particle System Setup
    let particles = null;
    if (canvasRef.current) {
      particles = new ParticleSystem(canvasRef.current);
      particles.start();
    }

    // 2. Typewriter Effect Setup
    let stopTypewriter = null;
    if (typewriterRef.current) {
      const phrases = [
        "Links at the speed of thought.",
        "Analytics that actually matter.",
        "Your brand. Your links. Your data.",
        "Zero friction. Maximum impact."
      ];
      stopTypewriter = startTypewriter(typewriterRef.current, phrases, {
        typeSpeed: 50,
        deleteSpeed: 30,
        pauseMs: 2500
      });
    }

    // 3. Navbar Scroll Compress Behavior
    const handleScroll = () => {
      const nav = navbarRef.current;
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.classList.add('compressed');
      } else {
        nav.classList.remove('compressed');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // 4. Magnetic CTA Buttons
    const cleanMagneticCta = applyMagnetic(ctaBtnRef.current, 0.25, 60);
    const cleanMagneticDemo = applyMagnetic(demoBtnRef.current, 0.25, 60);

    // 5. 3D Tilt Effect on Feature Cards
    const cleanTilts = featureCardsRef.current.map((card) => {
      if (card) return applyTilt(card, 6);
      return null;
    }).filter(Boolean);

    // Cleanup
    return () => {
      if (particles) particles.stop();
      if (stopTypewriter) stopTypewriter();
      window.removeEventListener('scroll', handleScroll);
      if (cleanMagneticCta) cleanMagneticCta();
      if (cleanMagneticDemo) cleanMagneticDemo();
      cleanTilts.forEach((clean) => clean());
    };
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!urlInput) {
      toast.error('Please enter a URL first!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/urls', { originalUrl: urlInput });
      if (data.success) {
        setShortenedUrl(data.url.shortUrl);
        setIsCopied(false);
        toast.success('Real short link generated!');
      } else {
        toast.error(data.message || 'Failed to generate short link.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate short link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortenedUrl) return;
    navigator.clipboard.writeText(shortenedUrl);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleTryDemo = (e) => {
    e.preventDefault();
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
      
      demoSection.classList.add('demo-highlight');
      setTimeout(() => {
        demoSection.classList.remove('demo-highlight');
      }, 1500);

      const input = demoSection.querySelector('.hero-input');
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 800);
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Dynamic Backgrounds */}
      <canvas ref={canvasRef} className="particles-canvas" />
      
      <div className="aurora-mesh-container">
        <div className="aurora-blob blob-violet"></div>
        <div className="aurora-blob blob-cyan"></div>
        <div className="aurora-blob blob-pink"></div>
      </div>

      <header ref={navbarRef} className="landing-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-sparkle">⚡</span>
            <span className="logo-valtex">V<span className="logo-lambda">Λ</span>LTEX</span>
          </Link>
          <div className="header-actions">
            {user ? (
              <Link to="/dashboard" className="btn-link primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-link text">Login</Link>
                <Link to="/signup" className="btn-link primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <div className="animated-badge fade-up fade-up-1">
            <Zap size={14} className="badge-icon" />
            <span>Links at the speed of thought</span>
          </div>

          <h1 className="hero-title fade-up fade-up-2">
            The Ultimate URL Engine <br />
            for Modern Brands
          </h1>

          <div className="typewriter-container fade-up fade-up-3">
            <span ref={typewriterRef} className="typewriter-text"></span>
            <span className="typewriter-cursor">|</span>
          </div>

          <p className="hero-subtitle fade-up fade-up-4">
            VΛLTEX is a premium, developer-first shortener and click analytics command center. Setup lightning fast redirects, downloadable QR codes, and monitor telemetry.
          </p>

          <div className="cta-group fade-up fade-up-5">
            <button ref={ctaBtnRef} className="btn-main primary" onClick={handleGetStarted}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button ref={demoBtnRef} className="btn-main outline" onClick={handleTryDemo}>
              Try Interactive Demo
            </button>
          </div>

          <div id="demo" className="demo-box card glass shine-border fade-up fade-up-5">
            <h3 className="demo-title grd">Test Drive VΛLTEX</h3>
            <form onSubmit={handleShorten} className="demo-form">
              <input
                type="url"
                placeholder="Paste your long URL here (e.g. https://google.com)..."
                value={urlInput}
                className="hero-input"
                onChange={(e) => setUrlInput(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary btn-demo-short" disabled={loading}>
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
            </form>

            {shortenedUrl && (
              <div className="demo-result">
                <span className="result-label">Your Short URL:</span>
                <div className="result-field">
                  <span className="result-text">{shortenedUrl}</span>
                  <button className="copy-result-btn" onClick={handleCopy}>
                    {isCopied ? <Check size={18} style={{ color: 'var(--accent-4)' }} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="demo-disclaimer">
                  * Register a free account to track clicks, download QR codes, and view browser/country analytics!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <h4>2.4M+</h4>
            <p>Links Created</p>
          </div>
          <div className="stat-card">
            <h4>98M+</h4>
            <p>Visits Tracked</p>
          </div>
          <div className="stat-card">
            <h4>150+</h4>
            <p>Countries Reached</p>
          </div>
          <div className="stat-card">
            <h4>99.9%</h4>
            <p>Platform Uptime</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title text-center">
            Everything you need in <span className="grd">one command center</span>
          </h2>
          <p className="section-subtitle text-center">
            Scale your reach with enterprise-grade redirection, custom routing parameters, and dynamic security layers.
          </p>

          <div className="features-grid">
            <div
              ref={(el) => (featureCardsRef.current[0] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-2)' }}>
                <Zap size={24} />
              </div>
              <h3>Fast Redirects</h3>
              <p>Instantaneous 301 server redirection routing users in fractions of a millisecond globally.</p>
            </div>

            <div
              ref={(el) => (featureCardsRef.current[1] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-1)' }}>
                <BarChart3 size={24} />
              </div>
              <h3>Deep Analytics</h3>
              <p>Granular logs of visitor devices, browsers, geographic countries, referrers, and hourly trends.</p>
            </div>

            <div
              ref={(el) => (featureCardsRef.current[2] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(236,72,153,0.1)', color: 'var(--accent-3)' }}>
                <Fingerprint size={24} />
              </div>
              <h3>Custom Aliases</h3>
              <p>Replace random codes with memorable phrases (e.g. /promo-launch) to scale your brand reach.</p>
            </div>

            <div
              ref={(el) => (featureCardsRef.current[3] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-4)' }}>
                <QrCode size={24} />
              </div>
              <h3>QR Code Engine</h3>
              <p>Auto-generate downloadable QR codes for print material and interactive marketing.</p>
            </div>

            <div
              ref={(el) => (featureCardsRef.current[4] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-5)' }}>
                <Calendar size={24} />
              </div>
              <h3>Link Expiry</h3>
              <p>Set a date and time threshold for links to expire automatically, protecting limited offers.</p>
            </div>

            <div
              ref={(el) => (featureCardsRef.current[5] = el)}
              className="feature-card card glass"
            >
              <div className="tilt-shine"></div>
              <div className="feature-icon-box" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-1)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3>Secure Auth</h3>
              <p>Password hashing, rate limiting, and secure JSON Web Tokens ensure account protection.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="logo">
              <span className="logo-sparkle" style={{ fontSize: '18px' }}>⚡</span>
              <span className="logo-valtex" style={{ fontSize: '18px' }}>V<span className="logo-lambda">Λ</span>LTEX</span>
            </span>
            <p>© {new Date().getFullYear()} VΛLTEX. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">API Docs</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes demoFlash {
          0% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 35px rgba(139, 92, 246, 0.6);
            border-color: var(--accent-1);
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            transform: scale(1);
          }
        }
        .demo-box.demo-highlight {
          animation: demoFlash 1.5s ease-in-out;
        }

        .landing-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-base);
          position: relative;
          z-index: 1;
        }

        /* Particles Background */
        .particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        /* SVG Aurora Background blobs */
        .aurora-mesh-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.15;
          transition: opacity 0.5s ease;
        }
        body.theme-light .aurora-mesh-container {
          opacity: 0.07;
        }

        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: auroraFloat 15s ease-in-out infinite alternate;
        }

        .blob-violet {
          width: 500px;
          height: 500px;
          background: var(--accent-1);
          top: -100px;
          left: -100px;
        }
        .blob-cyan {
          width: 600px;
          height: 600px;
          background: var(--accent-2);
          top: -200px;
          right: -100px;
          animation-delay: -5s;
        }
        .blob-pink {
          width: 450px;
          height: 450px;
          background: var(--accent-3);
          bottom: -150px;
          left: 30%;
          animation-delay: -10s;
        }

        .landing-header {
          position: sticky;
          top: 0;
          background: rgba(4, 6, 15, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          z-index: 100;
          height: 64px;
          transition: all 0.3s ease;
        }

        body.theme-light .landing-header {
          background: rgba(245, 247, 255, 0.6);
        }

        .landing-header.compressed {
          height: 52px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          background: rgba(4, 6, 15, 0.75);
        }
        body.theme-light .landing-header.compressed {
          background: rgba(245, 247, 255, 0.8);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          padding: 0 24px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ff);
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          transition: transform 0.3s ease;
        }

        .landing-header.compressed .logo {
          transform: scale(0.95);
        }

        .logo-sparkle {
          font-size: 20px;
          line-height: 1;
        }

        .logo-lambda {
          color: var(--accent-1);
          font-family: var(--ff);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-link {
          font-weight: 600;
          font-size: 14px;
          padding: 8px 18px;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .btn-link.text {
          color: var(--text-secondary);
        }

        .btn-link.text:hover {
          color: var(--text-primary);
        }

        .btn-link.primary {
          background: var(--grad-primary);
          color: #FFFFFF;
          box-shadow: var(--glow-violet);
        }

        .btn-link.primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .hero-section {
          padding: 100px 24px 80px 24px;
          flex: 1;
          z-index: 5;
          position: relative;
        }

        .hero-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .animated-badge {
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
          color: var(--accent-1);
          padding: 6px 14px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .badge-icon {
          color: var(--accent-2);
          animation: pulseDot 2s infinite;
        }

        .hero-title {
          font-family: var(--ff);
          font-size: 52px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1.5px;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .typewriter-container {
          height: 36px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .typewriter-text {
          font-family: var(--ff);
          font-size: 20px;
          font-weight: 600;
          color: var(--accent-2);
        }

        .typewriter-cursor {
          font-family: var(--ff);
          font-size: 20px;
          font-weight: 600;
          color: var(--accent-2);
          animation: pulseDot 1s infinite;
        }

        .hero-subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .cta-group {
          display: flex;
          gap: 16px;
          margin-bottom: 64px;
        }

        .btn-main {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .btn-main.primary {
          background: var(--grad-primary);
          color: #FFFFFF;
          box-shadow: var(--glow-violet);
        }

        .btn-main.outline {
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-primary);
        }

        .btn-main.outline:hover {
          background: var(--bg-hover);
        }

        .demo-box {
          max-width: 640px;
          width: 100%;
        }

        .demo-title {
          font-family: var(--ff);
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .demo-form {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .demo-form input {
          flex: 1;
        }

        .btn-demo-short {
          padding: 0 24px;
        }

        .demo-result {
          margin-top: 24px;
          background: rgba(0, 0, 0, 0.25);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
          text-align: left;
          width: 100%;
        }

        .result-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .result-field {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          padding: 10px 16px;
          border-radius: var(--radius-sm);
        }

        .result-text {
          font-family: var(--fm);
          color: var(--accent-2);
          font-size: 15px;
          word-break: break-all;
        }

        .copy-result-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.2s;
        }

        .copy-result-btn:hover {
          color: var(--text-primary);
        }

        .demo-disclaimer {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .stats-section {
          background: var(--bg-layer2);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 48px 24px;
          z-index: 5;
          position: relative;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          text-align: center;
        }

        .stat-card h4 {
          font-family: var(--ff);
          font-size: 38px;
          font-weight: 800;
          color: var(--accent-1);
          margin-bottom: 4px;
        }

        .stat-card p {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .features-section {
          padding: 100px 24px;
          z-index: 5;
          position: relative;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-family: var(--ff);
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .section-subtitle {
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 64px auto;
          font-size: 16px;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: border-color 0.3s ease;
        }

        .feature-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card h3 {
          font-family: var(--ff);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .landing-footer {
          background: var(--bg-layer2);
          border-top: 1px solid var(--border-subtle);
          padding: 40px 24px;
          margin-top: auto;
          z-index: 5;
          position: relative;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-right {
          display: flex;
          gap: 24px;
        }

        .footer-right a:hover {
          color: var(--text-primary);
        }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-container { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
          .stats-container { grid-template-columns: 1fr; gap: 24px; }
          .hero-title { font-size: 34px; }
          .demo-form { flex-direction: column; }
          .cta-group { flex-direction: column; width: 100%; }
          .cta-group button, .cta-group a { justify-content: center; }
          .footer-container { flex-direction: column; gap: 24px; text-align: center; }
        }
      `}</style>
    </div>
  );
}
