import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

/* ── Floating dashboard mockup data ── */
const topCandidates = [
  { rank: 1, initials: 'CM', name: 'Carlos Mendez', skills: 'Python, Go, Kubernetes', score: 94, color: 'bg-brand-500' },
  { rank: 2, initials: 'SC', name: 'Sarah Chen', skills: 'React, TypeScript, Node.js', score: 92, color: 'bg-emerald-500' },
  { rank: 3, initials: 'AO', name: 'Aisha Okafor', skills: 'React, Vue.js, TypeScript', score: 89, color: 'bg-teal-500' },
  { rank: 4, initials: 'MJ', name: 'Marcus Johnson', skills: 'Java, Spring Boot, Kubernetes', score: 87, color: 'bg-cyan-600' },
];

const stats = [
  { value: '12', label: 'Total', color: 'text-brand-500' },
  { value: '5', label: 'Shortlisted', color: 'text-emerald-500' },
  { value: '3', label: 'In Review', color: 'text-amber-500' },
  { value: '2', label: 'Rejected', color: 'text-red-400' },
];

const features = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Drag & drop PDF resumes',
  },
  {
    icon: Cpu,
    title: 'AI Parsing',
    description: 'Skills extracted automatically',
  },
  {
    icon: CheckCircle2,
    title: 'Auto-ranking',
    description: 'Scored against job needs',
  },
];

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* ─── NAVBAR ─── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <FileText className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold text-surface-900 dark:text-white tracking-tight block">
                Smart Resume
              </span>
              <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400 tracking-[0.2em] uppercase">
                Screening
              </span>
            </div>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  i === 0
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl gradient-brand shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative pt-28 pb-20 overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-brand-100/40 dark:bg-brand-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-50/60 dark:bg-brand-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left content */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/40 mb-6">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                    AI-powered recruitment screening
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-surface-900 dark:text-white"
              >
                Screen resumes in{' '}
                <br className="hidden sm:block" />
                seconds,{' '}
                <span className="text-gradient italic">not days.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 text-base sm:text-lg text-surface-500 dark:text-surface-400 leading-relaxed max-w-lg"
              >
                Smart Resume Screening uses AI to parse PDF resumes, extract key skills, and
                automatically rank candidates against your job requirements, so your team spends
                time interviewing, not sorting through paperwork.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors"
                  >
                    Login
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-400"
              >
                <span>No credit card required</span>
                <span className="hidden sm:inline">·</span>
                <span>Secure sign-in</span>
                <span className="hidden sm:inline">·</span>
                <span>PDF up to 10MB</span>
              </motion.div>

              {/* Feature cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                id="features"
                className="mt-10 grid grid-cols-3 gap-3"
              >
                {features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-soft transition-shadow group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-3 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                      <feat.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="text-sm font-bold text-surface-800 dark:text-white">{feat.title}</h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              {/* AI Match floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="absolute -top-2 -right-2 z-20"
              >
                <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl px-5 py-3 shadow-lg shadow-brand-500/25">
                  <span className="text-[10px] text-brand-100 font-medium block">AI Match</span>
                  <span className="text-2xl font-extrabold text-white">94%</span>
                </div>
              </motion.div>

              {/* Main dashboard card */}
              <div className="bg-white dark:bg-surface-900 rounded-3xl shadow-soft-lg border border-surface-100 dark:border-surface-800 p-6 relative overflow-hidden">
                {/* Window dots */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                {/* Dashboard header */}
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">Dashboard</h3>
                <p className="text-xs text-surface-400 mt-0.5">
                  Welcome back, Sarah. Here is your hiring overview.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mt-5">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 text-center"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 ${
                        i === 0 ? 'bg-brand-500' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-500' : 'bg-red-400'
                      }`} />
                      <p className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Top Candidates */}
                <h4 className="text-sm font-bold text-surface-900 dark:text-white mt-6 mb-3">
                  Top Candidates
                </h4>
                <div className="space-y-2.5">
                  {topCandidates.map((c) => (
                    <div
                      key={c.rank}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <span className="text-xs text-surface-400 w-5 text-right font-medium">
                        #{c.rank}
                      </span>
                      <div className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {c.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-800 dark:text-white truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-surface-400 truncate">{c.skills}</p>
                      </div>
                      <span className="text-lg font-bold text-surface-800 dark:text-white tabular-nums">
                        {c.score}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 rounded-full flex-shrink-0">
                        Shortlisted
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating toast notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-4 left-8 z-20"
              >
                <div className="bg-white dark:bg-surface-800 rounded-2xl px-5 py-3 shadow-glass-lg border border-surface-100 dark:border-surface-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800 dark:text-white">Resume parsed</p>
                    <p className="text-[11px] text-surface-400">12 skills extracted in 2s</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 bg-surface-50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400 max-w-lg mx-auto">
              Three simple steps from resume upload to ranked candidates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload Resumes',
                desc: 'Drag and drop PDF or DOCX resumes. Batch upload is supported for high-volume screening.',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'AI Extracts Data',
                desc: 'Our Gemini-powered parser identifies skills, experience, education, projects, and certifications.',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Review Rankings',
                desc: 'Candidates are scored against your job requirements using a weighted multi-factor algorithm.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm hover:shadow-soft transition-shadow group"
              >
                <span className="text-5xl font-black text-surface-100 dark:text-surface-700 absolute top-4 right-5 select-none group-hover:text-brand-100 dark:group-hover:text-brand-900/30 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-4 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                  <item.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / SECURITY ─── */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                Built for security{' '}
                <br className="hidden sm:block" />
                and scale
              </h2>
              <p className="mt-4 text-surface-500 dark:text-surface-400 leading-relaxed">
                Enterprise-grade security with Helmet headers, rate limiting, CORS,
                and JWT authentication. Deployed on AWS with DynamoDB, S3 private storage,
                and presigned URLs for secure resume access.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'End-to-end encrypted resume storage',
                  'Role-based access control',
                  'SOC 2 compliant infrastructure',
                  'Auto-scaling with Kubernetes',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="text-sm text-surface-700 dark:text-surface-300 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-950/30 dark:to-brand-900/10 rounded-3xl p-8 border border-brand-100 dark:border-brand-800/30"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '10k+', label: 'Resumes Processed' },
                  { value: '95%', label: 'Parsing Accuracy' },
                  { value: '<3s', label: 'Average Parse Time' },
                  { value: '99.9%', label: 'Uptime SLA' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                      {stat.value}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-brand rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to transform your hiring?
              </h2>
              <p className="mt-3 text-brand-100/80 max-w-md mx-auto">
                Join teams already using Smart Resume Screening to find the best candidates faster.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-surface-100 dark:border-surface-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
          <p className="text-xs text-surface-400">
            © {new Date().getFullYear()} Smart Resume Screening. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
