import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Upload as UploadIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard.jsx';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import SkillsBarChart from '../components/charts/SkillsBarChart.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { mockCandidates } from '../data/mockCandidates.js';
import { mockRecentActivity } from '../data/mockActivity.js';
import { getScoreColor, getInitials } from '../utils/formatters.js';
import { useMemo } from 'react';


export default function Dashboard() {
  const stats = useMemo(() => ({
    total: mockCandidates.length,
    shortlisted: mockCandidates.filter(c => c.status === 'shortlisted').length,
    rejected: mockCandidates.filter(c => c.status === 'rejected').length,
    review: mockCandidates.filter(c => c.status === 'review').length,
    pending: mockCandidates.filter(c => c.status === 'pending').length,
  }), []);

  const pieData = [
    { name: 'Shortlisted', value: stats.shortlisted },
    { name: 'In Review', value: stats.review },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  const skillCounts = useMemo(() => {
    const counts = {};
    mockCandidates.forEach(c => c.skills?.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    }));
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((item, i) => ({
        ...item,
        color: ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#3b82f6', '#8b5cf6', '#f59e0b'][i],
      }));
  }, []);

  const topCandidates = useMemo(
    () => [...mockCandidates].sort((a, b) => b.rankingScore - a.rankingScore).slice(0, 5),
    []
  );

  const activityIcons = {
    Upload: UploadIcon,
    CheckCircle,
    Eye,
    XCircle,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Welcome back, Sarah. Here is your hiring overview.
          </p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
        >
          <UploadIcon className="w-4 h-4" /> Upload Resume
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Candidates" value={stats.total} change="+3 this week" changeType="up" color="brand" delay={0} />
        <StatCard icon={CheckCircle} label="Shortlisted" value={stats.shortlisted} change="+2 this week" changeType="up" color="emerald" delay={0.1} />
        <StatCard icon={Eye} label="In Review" value={stats.review} change="2 urgent" changeType="neutral" color="amber" delay={0.2} />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} change="-1 vs last week" changeType="down" color="red" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-surface-900 dark:text-white">Top Candidates</h2>
            <Link to="/candidates" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 no-underline">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topCandidates.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/candidates/${candidate.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors no-underline"
                >
                  <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(candidate.firstName, candidate.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                      {candidate.skills?.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${getScoreColor(candidate.rankingScore)}`}>
                      {candidate.rankingScore}
                    </p>
                    <StatusBadge status={candidate.status} size="xs" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {mockRecentActivity.map((activity, i) => {
              const Icon = activityIcons[activity.icon] || Clock;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    activity.type === 'upload' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'shortlist' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    activity.type === 'reject' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed">{activity.message}</p>
                    <p className="text-[10px] text-surface-400 mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6" hover={false}>
          <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Candidate Status</h2>
          <StatusPieChart data={pieData} />
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Top Skills</h2>
          <SkillsBarChart data={skillCounts} />
        </GlassCard>
      </div>

      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-surface-900 dark:text-white">Quick Stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Score', value: Math.round(mockCandidates.reduce((a, c) => a + c.rankingScore, 0) / mockCandidates.length) },
            { label: 'Top Score', value: Math.max(...mockCandidates.map(c => c.rankingScore)) },
            { label: 'Skills Tracked', value: [...new Set(mockCandidates.flatMap(c => c.skills || []))].length },
            { label: 'This Month', value: '12 uploads' },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50"
            >
              <p className="text-xl font-bold text-surface-900 dark:text-white">{value}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
