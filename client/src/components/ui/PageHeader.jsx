import { motion } from 'framer-motion';

export default function PageHeader({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between mb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{title}</h1>
        {description && (
          <p className="text-sm text-surface-500 dark:text-surface-400">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
