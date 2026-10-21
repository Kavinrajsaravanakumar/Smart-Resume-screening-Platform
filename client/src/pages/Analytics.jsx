import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import SkillsBarChart from '../components/charts/SkillsBarChart.jsx';
import GenericBarChart from '../components/charts/GenericBarChart.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { mockCandidates } from '../data/mockCandidates.js';

export default function Analytics() {
  const skillData = useMemo(() => {
    const counts = {};
    mockCandidates.forEach(c => c.skills?.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    }));
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item, i) => ({
        ...item,
        color: ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'][i],
      }));
  }, []);

  const statusData = useMemo(() => [
    { name: 'Shortlisted', value: mockCandidates.filter(c => c.status === 'shortlisted').length },
    { name: 'In Review', value: mockCandidates.filter(c => c.status === 'review').length },
    { name: 'Pending', value: mockCandidates.filter(c => c.status === 'pending').length },
    { name: 'Rejected', value: mockCandidates.filter(c => c.status === 'rejected').length },
  ], []);

  const experienceData = useMemo(() => {
    const buckets = { '0-2 years': 0, '3-5 years': 0, '5+ years': 0 };
    mockCandidates.forEach(c => {
      const years = c.experience?.reduce((sum, exp) => {
        const match = exp.duration?.match(/(\d{4})\s*-\s*(Present|\d{4})/);
        if (match) {
          const end = match[2] === 'Present' ? 2026 : parseInt(match[2]);
          return sum + (end - parseInt(match[1]));
        }
        return sum;
      }, 0) || 0;
      if (years <= 2) buckets['0-2 years']++;
      else if (years <= 5) buckets['3-5 years']++;
      else buckets['5+ years']++;
    });
    return Object.entries(buckets).map(([name, count]) => ({ name, count }));
  }, []);

  const educationData = useMemo(() => {
    const counts = {};
    mockCandidates.forEach(c => c.education?.forEach(e => {
      const level = e.degree?.includes('Ph.D') ? 'Ph.D' :
                    e.degree?.includes('M.S') || e.degree?.includes('M.S.') || e.degree?.includes('MBA') ? "Master's" :
                    e.degree?.includes('M.Tech') ? "Master's" : "Bachelor's";
      counts[level] = (counts[level] || 0) + 1;
    }));
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const avgScore = useMemo(
    () => Math.round(mockCandidates.reduce((a, c) => a + c.rankingScore, 0) / mockCandidates.length),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Insights into your recruitment pipeline"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Candidates', value: mockCandidates.length, icon: BarChart3, color: 'brand' },
          { label: 'Avg. Score', value: avgScore, icon: TrendingUp, color: 'emerald' },
          { label: 'Unique Skills', value: [...new Set(mockCandidates.flatMap(c => c.skills || []))].length, icon: PieChartIcon, color: 'blue' },
          { label: 'Shortlisted', value: mockCandidates.filter(c => c.status === 'shortlisted').length, icon: TrendingUp, color: 'amber' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                color === 'brand' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' :
                color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Candidate Status Distribution</h3>
          <StatusPieChart data={statusData} />
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Skills Distribution</h3>
          <SkillsBarChart data={skillData} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Experience Distribution</h3>
          <GenericBarChart data={experienceData} />
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Education Levels</h3>
          <GenericBarChart data={educationData} />
        </GlassCard>
      </div>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Score Distribution</h3>
        <div className="grid grid-cols-5 gap-3">
          {[
            { range: '0-20', count: mockCandidates.filter(c => c.rankingScore < 20).length, color: 'bg-red-500' },
            { range: '20-40', count: mockCandidates.filter(c => c.rankingScore >= 20 && c.rankingScore < 40).length, color: 'bg-orange-500' },
            { range: '40-60', count: mockCandidates.filter(c => c.rankingScore >= 40 && c.rankingScore < 60).length, color: 'bg-amber-500' },
            { range: '60-80', count: mockCandidates.filter(c => c.rankingScore >= 60 && c.rankingScore < 80).length, color: 'bg-brand-500' },
            { range: '80-100', count: mockCandidates.filter(c => c.rankingScore >= 80).length, color: 'bg-emerald-500' },
          ].map(({ range, count, color }) => (
            <div key={range} className="text-center">
              <div className="h-32 bg-surface-100 dark:bg-surface-800 rounded-xl relative overflow-hidden mb-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(10, (count / mockCandidates.length) * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`absolute bottom-0 w-full ${color} rounded-xl opacity-80`}
                />
              </div>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{count}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">{range}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
