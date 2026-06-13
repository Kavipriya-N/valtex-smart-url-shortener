import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ParticleSystem } from '../animations/particles';
import FormInput from '../components/FormInput';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef(null);

  useEffect(() => {
    let particles = null;
    if (canvasRef.current) {
      particles = new ParticleSystem(canvasRef.current);
      particles.start();
    }
    return () => {
      if (particles) particles.stop();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await signup(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Email might already be in use.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <canvas ref={canvasRef} className="particles-canvas" />

      <div className="auth-card card glass shine-border fade-up">
        <Link to="/" className="auth-logo">
          <span className="logo-sparkle">⚡</span>
          <span className="logo-valtex">V<span className="logo-lambda">Λ</span>LTEX</span>
        </Link>

        <div className="auth-header">
          <h2>Create an account</h2>
          <p>Get started with free links, QR codes and analytics.</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormInput
            id="signupName"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon="👤"
          />

          <FormInput
            id="signupEmail"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon="✉"
          />

          <FormInput
            id="signupPassword"
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
            required
          />

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-base);
          padding: 24px;
          position: relative;
        }
        .particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px !important;
          z-index: 5;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ff);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 32px;
        }
        .logo-sparkle {
          font-size: 22px;
          line-height: 1;
        }
        .logo-lambda {
          color: var(--accent-1);
        }
        .auth-header {
          margin-bottom: 28px;
        }
        .auth-header h2 {
          font-family: var(--ff);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .auth-header p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }
        .auth-error {
          width: 100%;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #EF4444;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          margin-bottom: 24px;
          text-align: left;
        }
        .auth-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
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
        .auth-submit-btn {
          width: 100%;
          height: 44px;
          font-size: 15px;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        .auth-footer-text {
          margin-top: 28px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .auth-link {
          color: var(--accent-1);
          font-weight: 600;
          transition: var(--transition);
        }
        .auth-link:hover {
          color: var(--accent-2);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
