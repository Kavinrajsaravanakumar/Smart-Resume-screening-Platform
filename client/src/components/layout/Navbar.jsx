import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sun, Moon, Bell, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/candidates': 'Candidates',
  '/upload': 'Upload Resume',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/about': 'About',
  '/about-platform': 'About Platform',
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/candidates/')) return 'Candidate Details';
    if (pageTitles[path]) return pageTitles[path];
    return 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'HR Recruiter';

  return (
    <header className="h-16 glass-strong border-b border-surface-200/50 dark:border-surface-700/50 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-surface-900 dark:text-white">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <Search className="w-4 h-4 text-surface-400" />
          <span className="text-sm text-surface-400">Search...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-700 text-surface-500 font-mono">Ctrl+K</kbd>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-surface-900" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        <div className="w-px h-8 bg-surface-200 dark:bg-surface-700 mx-1" />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate('/settings#user-account');
            const el = document.getElementById('user-account');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          title="Go to User Account settings"
        >
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-glass">
            {getInitials(displayName)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-surface-900 dark:text-white leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {displayRole}
            </p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          title="Sign out"
          className="p-2.5 rounded-xl text-surface-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
}
