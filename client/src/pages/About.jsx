import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sliders,
  CheckCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Target,
  Users,
  Building,
  Briefcase,
  ChevronDown,
  Mail,
  Sparkles,
  Upload,
  Lock,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const howItWorksSteps = [
  {
    step: '1',
    icon: Upload,
    title: 'Upload Resumes',
    desc: 'Simply drag and drop single or multiple candidate resumes in PDF format (up to 10MB per file).',
  },
  {
    step: '2',
    icon: Brain,
    title: 'AI Reads the Resume',
    desc: 'Our Gemini-powered engine extracts verified work history, skills, education, projects, and contact info without hallucinations.',
  },
  {
    step: '3',
    icon: Sliders,
    title: 'Custom Skill Scoring',
    desc: 'Candidates are evaluated automatically against your customizable Job Profile weights and mandatory requirements.',
  },
  {
    step: '4',
    icon: CheckCircle,
    title: 'You Shortlist',
    desc: 'Inspect the ranked pipeline, review matched vs missing skills, view the original PDF in-app, and move candidates forward.',
  },
];

const targetAudiences = [
  {
    icon: Users,
    title: 'HR & People Operations',
    desc: 'Eliminate manual screening fatigue and standardize candidate evaluations across hiring teams.',
  },
  {
    icon: Briefcase,
    title: 'Recruiters & Sourcers',
    desc: 'Instantly pinpoint top talent based on critical mandatory technical and domain competencies.',
  },
  {
    icon: Building,
    title: 'Hiring Managers',
    desc: 'Make rapid interview decisions with transparent score breakdowns and quick PDF viewer access.',
  },
];

const coreBenefits = [
  {
    icon: Clock,
    title: 'Saves 70%+ Screening Time',
    desc: 'Cut resume review from hours to minutes so you can focus on interviewing the best applicants.',
  },
  {
    icon: Target,
    title: 'Consistent & Fair Scoring',
    desc: 'Standardized criteria reduce human bias and fatigue, ensuring every candidate is judged objectively.',
  },
  {
    icon: ShieldCheck,
    title: 'Single Organized Workspace',
    desc: 'Store candidate profiles, original PDFs, parsed details, and hiring status in one centralized system.',
  },
];

const faqs = [
  {
    q: 'Which file formats are supported?',
    a: 'Smart Resume Screening currently accepts standard PDF resume files up to 10MB in size. PDFs are stored securely and viewable directly inside our integrated viewer.',
  },
  {
    q: 'How is candidate score calculated?',
    a: 'Scores are computed against your active Job Profile. We calculate a weighted match of required skills (1–5 importance) and factor in years of experience, highest education, and projects. If any mandatory skill is absent, the score is capped at 50% to ensure key prerequisites are met.',
  },
  {
    q: 'Is candidate data private and secure?',
    a: 'Absolutely. Candidate records and original PDF buffers are stored in your secure MongoDB database with protected JWT authentication and per-user isolation. Your resumes are only visible to your account.',
  },
  {
    q: 'Can I change scoring rules after resumes are uploaded?',
    a: 'Yes! In the Settings page, you can customize required skills, weights, and minimum experience at any time. Simply click "Save & Re-score all candidates" to immediately recalculate rankings for your talent pool.',
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="About Smart Resume Screening"
        description="Empowering HR teams and hiring managers with intelligent, objective candidate screening"
      />

      {/* ── Overview & Problem Solved ── */}
      <GlassCard className="p-8" hover={false}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white flex-shrink-0 shadow-glass">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="text-center sm:text-left space-y-3">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
              What is Smart Resume Screening?
            </h2>
            <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
              Smart Resume Screening is an intelligent recruitment assistant built for modern HR teams. It solves one of recruitment's biggest bottlenecks: <strong className="text-surface-900 dark:text-white font-semibold">manual resume screening is slow, repetitive, and inconsistent</strong>.
            </p>
            <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
              Recruiters receive hundreds of resumes per opening and often spend only 6 to 8 seconds scanning each page. This leads to fatigue, overlooked qualified talent, and unconscious bias. Our platform parses every resume thoroughly, compares candidates objectively against your customizable job requirements, and ranks them by merit.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── How It Works (4 Steps) ── */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-surface-900 dark:text-white">
            How It Works in 4 Simple Steps
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          {howItWorksSteps.map(({ step, icon: Icon, title, desc }) => (
            <motion.div
              key={step}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 flex gap-4 items-start"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {step}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-500" />
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* ── Two-Column Responsive Grid: Who It Is For & Key Benefits ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Who It Is For */}
        <GlassCard className="p-6 h-full flex flex-col justify-between min-w-0" hover={false}>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                Who It Is For
              </h3>
            </div>
            <div className="space-y-4">
              {targetAudiences.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Key Benefits */}
        <GlassCard className="p-6 h-full flex flex-col justify-between min-w-0" hover={false}>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                Key Benefits
              </h3>
            </div>
            <div className="space-y-4">
              {coreBenefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Two-Column Grid: FAQs & Security/Contact ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* FAQs */}
        <GlassCard className="lg:col-span-2 p-6 min-w-0" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-surface-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-surface-200/70 dark:border-surface-700/60 overflow-hidden bg-surface-50/50 dark:bg-surface-800/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-surface-900 dark:text-white hover:bg-surface-100/50 dark:hover:bg-surface-800/60 transition-colors"
                  >
                    <span>{q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 pt-1 text-xs text-surface-600 dark:text-surface-300 leading-relaxed border-t border-surface-200/30 dark:border-surface-700/30"
                      >
                        {a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Security & Support Details */}
        <div className="space-y-6">
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-surface-900 dark:text-white">Data Privacy</h3>
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
              All candidate resumes and evaluation metrics are isolated per HR account. Only authorized recruiters from your organization can view candidates you screen.
            </p>
            <div className="p-3 rounded-xl bg-surface-100/70 dark:bg-surface-800/60 text-[11px] text-surface-500 space-y-1.5">
              <p className="font-semibold text-surface-700 dark:text-surface-300">Security Highlights:</p>
              <p>• Strict JWT authentication</p>
              <p>• Per-user MongoDB multi-tenancy</p>
              <p>• Encrypted in-memory & database stream</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-xs">
                SRS
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">Version 2.0</p>
                <p className="text-xs text-surface-500">Production Release</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-200/50 dark:border-surface-700/50">
              <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <a
                href="mailto:support@smartresume.ai"
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium truncate"
              >
                support@smartresume.ai
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
