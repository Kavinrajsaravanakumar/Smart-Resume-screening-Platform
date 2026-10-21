import { motion } from 'framer-motion';
import { Heart, Code, Cpu, Palette, Database, Globe, Zap } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const techStack = [
  { name: 'React 18', icon: Code, description: 'UI library with hooks and concurrent features', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Vite', icon: Zap, description: 'Lightning-fast build tool and dev server', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS framework', color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30' },
  { name: 'React Router', icon: Globe, description: 'Declarative routing for React', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  { name: 'Framer Motion', icon: Cpu, description: 'Production-ready animations', color: 'text-brand-500 bg-brand-100 dark:bg-brand-900/30' },
  { name: 'Recharts', icon: Database, description: 'Composable charting library', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
];

const features = [
  { title: 'Dashboard', desc: 'Real-time overview of recruitment pipeline with statistics and charts' },
  { title: 'Candidate Management', desc: 'Full CRUD with search, filter, sort, and pagination' },
  { title: 'Resume Preview', desc: 'In-browser PDF preview with zoom controls' },
  { title: 'AI Resume Upload', desc: 'Drag-and-drop upload with progress animation' },
  { title: 'Analytics', desc: 'Skills distribution, experience, education, and score breakdowns' },
  { title: 'Dark Mode', desc: 'Full dark/light theme toggle with smooth transitions' },
  { title: 'Responsive Design', desc: 'Works seamlessly across desktop, tablet, and mobile' },
  { title: 'Glassmorphism UI', desc: 'Modern glass-effect design with soft shadows and animations' },
];

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="About"
        description="Smart Resume Screening Platform"
      />

      <GlassCard className="p-8 text-center" hover={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-glass-lg">
            SRS
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
            Smart Resume Screening
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Version 2.0</p>
          <p className="text-base text-surface-600 dark:text-surface-300 max-w-xl mx-auto leading-relaxed">
            A modern, frontend-only HR recruitment dashboard showcasing professional UI design
            with glassmorphism aesthetics, smooth animations, and a complete candidate management workflow.
          </p>
        </motion.div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Technology Stack</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tech.color}`}>
                <tech.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{tech.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
            >
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{feature.title}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Project Highlights</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Components', value: '20+' },
            { label: 'Pages', value: '8' },
            { label: 'Mock Candidates', value: '12' },
            { label: 'Charts', value: '5' },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-3 rounded-xl bg-brand-50 dark:bg-brand-950/20"
            >
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400">{value}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 text-center" hover={false}>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Built with <Heart className="w-3.5 h-3.5 inline text-red-500 fill-red-500" /> using React, Tailwind CSS, and modern web technologies.
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
          This is a frontend-only demo application. No backend services, databases, or external APIs are used.
        </p>
      </GlassCard>
    </div>
  );
}
