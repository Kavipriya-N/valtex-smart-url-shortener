import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ParticleSystem } from '../animations/particles';
import FormInput from '../components/FormInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
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
    const tempErrors = {};
    if (!email) tempErrors.email = 'Email address is required.';
    if (!password) tempErrors.password = 'Password is required.';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      toast.error('Please fix form validation errors.');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ email: errMsg });
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
          <h2>Welcome back</h2>
          <p>Login to manage your links and see telemetry data.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormInput
            id="loginEmail"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            icon="✉"
          />

          <FormInput
            id="loginPassword"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
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
        .auth-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .auth-submit-btn {
          width: 100%;
          height: 48px;
          font-size: 15px;
          margin-top: 12px;
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
