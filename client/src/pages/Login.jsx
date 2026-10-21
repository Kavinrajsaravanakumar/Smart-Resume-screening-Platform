import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Building2,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-10 xl:p-14">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(20,184,166,0.3),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-950/50 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-10 w-60 h-60 bg-brand-300/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight block leading-tight">
                Smart Resume
              </span>
              <span className="text-brand-200 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Screening
              </span>
            </div>
          </motion.div>

          {/* Hero headline */}
          <div className="flex-1 flex flex-col justify-center -mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
                <span className="text-white">Hire smarter,</span>
                <br />
                <span className="text-brand-200">not harder.</span>
              </h1>
              <p className="mt-5 text-brand-100/80 text-sm leading-relaxed max-w-sm">
                Upload resumes, let AI extract skills, and get ranked candidates in seconds.
              </p>
            </motion.div>

            {/* Feature bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 space-y-3"
            >
              {[
                'AI-powered resume parsing',
                'Automatic candidate ranking',
                'Hiring analytics at a glance',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                  <span className="text-white/90 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Candidate preview card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 max-w-xs"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center text-white text-xs font-bold">
                      CM
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Carlos Mendez</p>
                      <p className="text-brand-200/70 text-xs">Python, Go, Kubernetes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand-300">94</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex-1 bg-white/10 rounded-full h-1.5 mr-3">
                    <div className="bg-brand-400 h-1.5 rounded-full" style={{ width: '94%' }} />
                  </div>
                  <span className="text-[10px] font-semibold text-brand-900 bg-brand-300 px-2.5 py-0.5 rounded-full">
                    Shortlisted
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (LOGIN FORM) ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-white dark:bg-surface-950 relative">
        {/* Mobile logo (visible only on small screens) */}
        <div className="lg:hidden mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-surface-900 dark:text-white font-bold text-base block leading-tight">
              Smart Resume
            </span>
            <span className="text-brand-600 dark:text-brand-400 text-[10px] font-semibold tracking-[0.2em] uppercase">
              Screening
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400 text-sm">
              Sign in to your Smart Resume account to continue.
            </p>
          </div>

          {/* Error alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.mitchell@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                    ${rememberMe
                      ? 'bg-brand-500 border-brand-500'
                      : 'border-surface-300 dark:border-surface-600 group-hover:border-brand-400'
                    }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
            <span className="text-xs text-surface-400">or</span>
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
          </div>

          {/* SSO */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Continue with Company SSO
          </motion.button>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Create account
            </Link>
          </p>

          {/* AI badge */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/30 border border-brand-200/50 dark:border-brand-800/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-xs text-brand-700 dark:text-brand-300 font-medium">
                AI Powered
              </span>
              <span className="text-xs text-surface-400">·</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                Resume parsing by Gemini AI
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
