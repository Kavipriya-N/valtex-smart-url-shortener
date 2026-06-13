import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile  from './pages/Profile';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'var(--bg-layer1)'
    }}>
      <div style={{
        width:40, height:40,
        border:'3px solid var(--border-default)',
        borderTopColor:'var(--accent-1)',
        borderRadius:'50%',
        animation:'spin 0.8s linear infinite'
      }}/>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
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
            }}
          />
          <Routes>
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup"   element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/analytics/:urlId"
              element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/profile"
              element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
