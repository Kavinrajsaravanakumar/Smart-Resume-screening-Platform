import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, change, changeType = 'neutral', color = 'brand', delay = 0 }) {
  const iconBgMap = {
    brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBgMap[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            changeType === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
            changeType === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
            'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'
          }`}>
            {changeType === 'up' && '↑'}{changeType === 'down' && '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
    </motion.div>
  );
}
