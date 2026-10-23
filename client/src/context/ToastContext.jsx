import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toastHelpers = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    addToast,
  };
  toastHelpers.toast = toastHelpers;

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-glass-lg backdrop-blur-md border text-sm font-medium ${
                t.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100'
                  : t.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/30 text-rose-100'
                  : 'bg-surface-900/90 border-surface-700/50 text-white'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-brand-400 flex-shrink-0" />}
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
