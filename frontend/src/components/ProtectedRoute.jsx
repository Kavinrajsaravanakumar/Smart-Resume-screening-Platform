import { Navigate } from 'react-router-dom';
import { getSession } from '../api/auth';

export default function ProtectedRoute({ children }) {
  const { token } = getSession();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
