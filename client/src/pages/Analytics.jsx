import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertCircle, Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import SkillsBarChart from '../components/charts/SkillsBarChart.jsx';
import GenericBarChart from '../components/charts/GenericBarChart.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import api from '../api.js';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/analytics');
        if (res?.data) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.error('Analytics API error:', err);
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const totalCandidates = analyticsData?.totalCandidates || 0;

  const skillData = useMemo(() => {
    if (!analyticsData?.skillsDistribution) return [];
    const palette = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
    return analyticsData.skillsDistribution.slice(0, 10).map((item, i) => ({
      name: item.skill || item.name,
      count: item.count,
      color: palette[i % palette.length],
    }));
  }, [analyticsData]);

  const statusData = useMemo(() => {
    if (!analyticsData?.statusDistribution) return [];
    return analyticsData.statusDistribution.map(s => ({
      name: s.status || s.name,
      value: s.count ?? s.value ?? 0,
    }));
  }, [analyticsData]);

  const experienceData = useMemo(() => {
    if (!analyticsData?.experienceDistribution) return [];
    return analyticsData.experienceDistribution.map(e => ({
      name: e.bucket || e.name,
      count: e.count,
    }));
  }, [analyticsData]);

  const educationData = useMemo(() => {
    if (!analyticsData?.educationLevels) return [];
    return analyticsData.educationLevels.map(e => ({
      name: e.level || e.name,
      count: e.count,
    }));
  }, [analyticsData]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-surface-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm font-medium">Aggregating recruitment metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <p className="text-base font-bold text-surface-900 dark:text-white mb-1">Failed to load analytics</p>
        <p className="text-xs text-surface-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (totalCandidates === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Insights into your recruitment pipeline" />
        <GlassCard className="p-16 text-center max-w-lg mx-auto" hover={false}>
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
            No analytics data yet
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
            No candidates yet. Upload a resume to get started and see real-time skill distribution, experience breakdown, education level analysis, and match scores.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
          >
            Upload Resume
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive insights across your recruitment pipeline"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        {[
          { label: 'Total Candidates', value: totalCandidates, icon: BarChart3, color: 'brand' },
          { label: 'Avg. Match Score', value: `${analyticsData?.averageScore || 0}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'Unique Skills Tracked', value: analyticsData?.uniqueSkillsCount || 0, icon: PieChartIcon, color: 'blue' },
          { label: 'Shortlisted Candidates', value: analyticsData?.shortlistedCount || 0, icon: TrendingUp, color: 'amber' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 shadow-soft min-w-0"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        <GlassCard className="p-6 min-w-0" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Candidate Status Distribution</h3>
          <StatusPieChart data={statusData} />
        </GlassCard>

        <GlassCard className="p-6 min-w-0" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Top 10 Pipeline Skills</h3>
          <SkillsBarChart data={skillData} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        <GlassCard className="p-6 min-w-0" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Experience Distribution</h3>
          <GenericBarChart data={experienceData} />
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Education Levels</h3>
          <GenericBarChart data={educationData} />
        </GlassCard>
      </div>
    </div>
  );
}
