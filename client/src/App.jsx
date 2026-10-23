import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Candidates from './pages/Candidates.jsx';
import CandidateDetails from './pages/CandidateDetails.jsx';
import ResumePreview from './pages/ResumePreview.jsx';
import UploadResume from './pages/UploadResume.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app routes — wrapped in layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <AppLayout><Candidates /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates/:id"
        element={
          <ProtectedRoute>
            <AppLayout><CandidateDetails /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates/:id/resume"
        element={
          <ProtectedRoute>
            <AppLayout><ResumePreview /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout><UploadResume /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppLayout><Analytics /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout><Settings /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about-platform"
        element={
          <ProtectedRoute>
            <AppLayout><About /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AppLayout><About /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
