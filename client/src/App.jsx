import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './styles/globals.css';

const Private = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-layer1)',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid var(--border-default)',
        borderTopColor: 'var(--accent-1)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const Public = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/"           element={<Landing />} />
            <Route path="/login"      element={<Public><Login /></Public>} />
            <Route path="/signup"     element={<Public><Signup /></Public>} />
            <Route path="/dashboard"  element={<Private><Dashboard /></Private>} />
            <Route path="/analytics/:urlId" element={<Private><Analytics /></Private>} />
            <Route path="/profile"    element={<Private><Profile /></Private>} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
