import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, User, Shield, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { FileText } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    candidateUpdates: true,
    weeklyDigest: false,
    newUploads: true,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" description="Manage your preferences and profile" />

      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-surface-900 dark:text-white">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-xl font-bold shadow-glass">
            SM
          </div>
          <div>
            <p className="text-lg font-bold text-surface-900 dark:text-white">Sarah Mitchell</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">HR Director · Human Resources</p>
            <p className="text-xs text-surface-400 dark:text-surface-500">sarah.mitchell@company.com</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1 block">Full Name</label>
            <input
              type="text"
              defaultValue="Sarah Mitchell"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1 block">Email</label>
            <input
              type="email"
              defaultValue="sarah.mitchell@company.com"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-surface-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-brand-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">Theme</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              theme === 'dark' ? 'bg-brand-500' : 'bg-surface-300'
            }`}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            />
          </motion.button>
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-surface-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for important updates' },
            { key: 'candidateUpdates', label: 'Candidate Updates', desc: 'Get notified when candidate status changes' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary of hiring activity' },
            { key: 'newUploads', label: 'New Uploads', desc: 'Get notified when new resumes are uploaded' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{label}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{desc}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleNotification(key)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  notifications[key] ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
                }`}
              >
                <motion.div
                  animate={{ x: notifications[key] ? 28 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-surface-900 dark:text-white">About This App</h2>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Smart Resume Screening v2.0 — A frontend-only demo showcasing a professional HR recruitment dashboard
          with AI-powered resume parsing capabilities.
        </p>
      </GlassCard>
    </div>
  );
}
