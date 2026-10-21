import { motion } from 'framer-motion';

export default function LoadingSkeleton({ type = 'card', count = 4 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 animate-pulse"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-200 dark:bg-surface-700 mb-4" />
            <div className="h-8 w-20 rounded-lg bg-surface-200 dark:bg-surface-700 mb-2" />
            <div className="h-4 w-32 rounded bg-surface-200 dark:bg-surface-700" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 flex items-center gap-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="h-3 w-56 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
            <div className="h-6 w-20 rounded-full bg-surface-200 dark:bg-surface-700" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-48 rounded-lg bg-surface-200 dark:bg-surface-700 mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-4 w-3/4 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
