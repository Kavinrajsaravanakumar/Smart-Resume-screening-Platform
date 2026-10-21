import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const roleOptions = [
  { value: 'HR Recruiter', label: 'HR Recruiter' },
  { value: 'Hiring Manager', label: 'Hiring Manager' },
  { value: 'Team Lead', label: 'Team Lead' },
  { value: 'Admin', label: 'Administrator' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: 'HR Recruiter',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const passwordChecks = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'Contains a number', met: /\d/.test(form.password) },
    { label: 'Passwords match', met: form.confirmPassword.length > 0 && form.password === form.confirmPassword },
  ];

  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (!allChecksMet) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(20,184,166,0.25),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-950/50 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 bg-brand-300/10 rounded-full blur-3xl" />

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
                <span className="text-white">Join the future</span>
                <br />
                <span className="text-brand-200">of hiring.</span>
              </h1>
              <p className="mt-5 text-brand-100/80 text-sm leading-relaxed max-w-sm">
                Create your account and start screening resumes with AI-powered intelligence in minutes.
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
                'Set up in under 2 minutes',
                'No credit card required',
                'Free for teams up to 5 members',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                  <span className="text-white/90 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 max-w-xs"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/15">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-brand-300" />
                  <span className="text-white/80 text-xs font-semibold">Platform Highlights</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '10k+', label: 'Resumes Parsed' },
                    { value: '95%', label: 'Accuracy' },
                    { value: '<3s', label: 'Parse Time' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl font-bold text-brand-300">{stat.value}</p>
                      <p className="text-[10px] text-brand-100/60 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (REGISTER FORM) ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-white dark:bg-surface-950 relative py-10">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-3">
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
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400 text-sm">
              Get started with Smart Resume Screening today.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    id="register-first-name"
                    type="text"
                    value={form.firstName}
                    onChange={update('firstName')}
                    placeholder="Sarah"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    id="register-last-name"
                    type="text"
                    value={form.lastName}
                    onChange={update('lastName')}
                    placeholder="Mitchell"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="register-email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="sarah.mitchell@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Company + Role row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    id="register-company"
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    placeholder="Acme Corp"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <select
                    id="register-role"
                    value={form.role}
                    onChange={update('role')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Create a strong password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="register-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password strength indicators */}
            {form.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-x-4 gap-y-1.5"
              >
                {passwordChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                        check.met
                          ? 'bg-brand-500'
                          : 'border border-surface-300 dark:border-surface-600'
                      }`}
                    >
                      {check.met && (
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        check.met ? 'text-brand-600 dark:text-brand-400' : 'text-surface-400'
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <div
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0
                  ${agreeTerms
                    ? 'bg-brand-500 border-brand-500'
                    : 'border-surface-300 dark:border-surface-600 group-hover:border-brand-400'
                  }`}
              >
                {agreeTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-surface-500 dark:text-surface-400 leading-snug">
                I agree to the{' '}
                <button type="button" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || !agreeTerms}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Sign in
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
