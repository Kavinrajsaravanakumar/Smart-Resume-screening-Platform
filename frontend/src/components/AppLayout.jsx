import { NavLink } from 'react-router-dom';
import { BarChart3, BriefcaseBusiness, FileUp, Home, LogIn, LogOut, Users } from 'lucide-react';
import { clearSession, getSession } from '../api/auth';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/upload', label: 'Upload', icon: FileUp },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 }
];

export default function AppLayout({ children }) {
  const { token, user } = getSession();

  function handleLogout() {
    clearSession();
    window.location.href = '/login';
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BriefcaseBusiness size={28} />
          <span>Smart Resume Screening</span>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          {!token && (
            <NavLink to="/login" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LogIn size={18} />
              <span>HR Login</span>
            </NavLink>
          )}
        </nav>
        {token && (
          <div className="session-panel">
            <span>{user?.name || 'HR User'}</span>
            <button className="nav-item logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
