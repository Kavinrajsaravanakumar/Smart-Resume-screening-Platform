import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Upload,
  BarChart3,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/candidates', label: 'Candidates', icon: Users },
  { path: '/upload', label: 'Upload Resume', icon: Upload },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about-platform', label: 'About', icon: Info },
];

export default function Sidebar({ collapsed: propCollapsed, setCollapsed: propSetCollapsed }) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const setCollapsed = propSetCollapsed || setInternalCollapsed;
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 90 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen flex-shrink-0 flex flex-col glass-strong shadow-soft-lg border-r border-surface-200/50 dark:border-surface-700/50 z-30 select-none overflow-hidden"
    >
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} h-16 border-b border-surface-200/50 dark:border-surface-700/50 flex-shrink-0`}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glass">
          <img src="./logo.svg" alt="SRS Logo" className="w-5 h-5 object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-bold text-surface-900 dark:text-white tracking-tight">
                Smart Resume
              </span>
              <br />
              <span className="text-[10px] font-medium text-brand-600 dark:text-brand-400 tracking-widest uppercase">
                Screening
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className="block"
            >
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-500 dark:text-brand-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm overflow-hidden whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-surface-200/50 dark:border-surface-700/50 flex-shrink-0">
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 dark:from-brand-500/5 dark:to-brand-600/5 border border-brand-500/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">AI Powered Resume parsing</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
