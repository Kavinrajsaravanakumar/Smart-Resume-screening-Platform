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
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard.jsx';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import SkillsBarChart from '../components/charts/SkillsBarChart.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { getScoreColor, getInitials } from '../utils/formatters.js';
import { useState, useEffect, useMemo } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [dashRes, candRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/candidates'),
        ]);

        if (dashRes?.data) {
          setDashboardData(dashRes.data);
        }
        if (candRes?.data) {
          setCandidates(candRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (dashboardData?.totals) {
      return {
        total: dashboardData.totals.total || 0,
        shortlisted: dashboardData.totals.shortlisted || 0,
        rejected: dashboardData.totals.rejected || 0,
        review: dashboardData.totals.inReview || dashboardData.totals.review || 0,
        pending: dashboardData.totals.pending || 0,
      };
    }
    return {
      total: candidates.length,
      shortlisted: candidates.filter(c => (c.status || '').toLowerCase() === 'shortlisted').length,
      rejected: candidates.filter(c => (c.status || '').toLowerCase() === 'rejected').length,
      review: candidates.filter(c => (c.status || '').toLowerCase() === 'review' || (c.status || '').toLowerCase() === 'in review').length,
      pending: candidates.filter(c => (c.status || '').toLowerCase() === 'pending').length,
    };
  }, [dashboardData, candidates]);

  const pieData = useMemo(() => [
    { name: 'Shortlisted', value: stats.shortlisted },
    { name: 'In Review', value: stats.review },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ], [stats]);

  const skillCounts = useMemo(() => {
    const counts = {};
    candidates.forEach(c => c.skills?.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    }));
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((item, i) => ({
        ...item,
        color: ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#3b82f6', '#8b5cf6', '#f59e0b'][i % 8],
      }));
  }, [candidates]);

  const topCandidates = useMemo(() => {
    if (dashboardData?.topCandidates && dashboardData.topCandidates.length > 0) {
      return dashboardData.topCandidates;
    }
    return [...candidates]
      .sort((a, b) => (b.score ?? b.rankingScore ?? 0) - (a.score ?? a.rankingScore ?? 0))
      .slice(0, 5);
  }, [dashboardData, candidates]);

  const activities = useMemo(() => {
    if (dashboardData?.recentActivities && dashboardData.recentActivities.length > 0) {
      return dashboardData.recentActivities;
    }
    return [];
  }, [dashboardData]);

  const activityIcons = {
    Upload: UploadIcon,
    uploaded: UploadIcon,
    CheckCircle,
    shortlist: CheckCircle,
    shortlisted: CheckCircle,
    Eye,
    review: Eye,
    XCircle,
    reject: XCircle,
    rejected: XCircle,
  };

  // Welcome user name from real authentication
  const displayName = user?.name || user?.firstName || 'Recruiter';

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-surface-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm font-medium">Loading recruitment dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <p className="text-base font-bold text-surface-900 dark:text-white mb-1">Failed to load dashboard</p>
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

  return (
    <div className="space-y-6">
      {/* Header with real user name */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Welcome back, {displayName}. Here is your hiring overview.
          </p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
        >
          <UploadIcon className="w-4 h-4" /> Upload Resume
        </Link>
      </motion.div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Candidates"
          value={stats.total}
          change={stats.total > 0 ? dashboardData?.thisWeek?.changes?.total : null}
          changeType="up"
          color="brand"
          delay={0}
        />
        <StatCard
          icon={CheckCircle}
          label="Shortlisted"
          value={stats.shortlisted}
          change={stats.total > 0 ? dashboardData?.thisWeek?.changes?.shortlisted : null}
          changeType="up"
          color="emerald"
          delay={0.1}
        />
        <StatCard
          icon={Eye}
          label="In Review"
          value={stats.review}
          change={stats.total > 0 ? dashboardData?.thisWeek?.changes?.inReview : null}
          changeType="neutral"
          color="amber"
          delay={0.2}
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          change={stats.total > 0 ? dashboardData?.thisWeek?.changes?.rejected : null}
          changeType="down"
          color="red"
          delay={0.3}
        />
      </div>

      {/* Empty State when no candidates exist yet */}
      {candidates.length === 0 ? (
        <GlassCard className="p-16 text-center max-w-lg mx-auto" hover={false}>
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
            No candidates yet
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
            No candidates yet. Upload a resume to get started. The platform will automatically extract skills, calculate experience, and evaluate candidates against your active scoring profile.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
          >
            <UploadIcon className="w-4 h-4" /> Upload Resume to Get Started
          </Link>
        </GlassCard>
      ) : (
        <>
          {/* Top Candidates and Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GlassCard className="lg:col-span-2 p-6" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-surface-900 dark:text-white">Top Ranked Candidates</h2>
                <Link to="/candidates" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 no-underline">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {topCandidates.map((candidate, i) => {
                  const scoreVal = candidate.score ?? candidate.rankingScore ?? 0;
                  const candId = candidate.id || candidate._id;
                  const fName = candidate.firstName || candidate.name?.split(' ')[0] || '';
                  const lName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
                  return (
                    <motion.div
                      key={candId || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/candidates/${candId}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors no-underline"
                      >
                        <span className="text-xs font-bold text-surface-400 w-5">#{i + 1}</span>
                        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                          {candidate.initials || getInitials(fName, lName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                            {candidate.name || `${fName} ${lName}`}
                          </p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                            {candidate.skills?.slice(0, 3).join(', ')}
                            {candidate.location ? ` · ${candidate.location}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getScoreColor(scoreVal)}`}>
                            {scoreVal}%
                          </p>
                          <StatusBadge status={candidate.status} size="xs" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity, i) => {
                    const Icon = activityIcons[activity.icon] || activityIcons[activity.type] || Clock;
                    return (
                      <motion.div
                        key={activity.id || activity._id || i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          activity.type === 'upload' || activity.type === 'uploaded' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          activity.type === 'shortlist' || activity.type === 'shortlisted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                          activity.type === 'reject' || activity.type === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed">{activity.message}</p>
                          <p className="text-[10px] text-surface-400 mt-0.5">{activity.time || 'recently'}</p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-xs text-surface-400 py-6 text-center italic">No recent activity logged</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-6" hover={false}>
              <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Candidate Status Distribution</h2>
              <StatusPieChart data={pieData} />
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Top Pipeline Skills</h2>
              {skillCounts.length > 0 ? (
                <SkillsBarChart data={skillCounts} />
              ) : (
                <p className="text-xs text-surface-400 py-12 text-center italic">No skills extracted yet</p>
              )}
            </GlassCard>
          </div>

          {/* Quick Stats Banner */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-bold text-surface-900 dark:text-white">Pipeline Summary</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Average Score',
                  value: candidates.length > 0
                    ? `${Math.round(candidates.reduce((a, c) => a + (c.score ?? c.rankingScore ?? 0), 0) / candidates.length)}%`
                    : '0%',
                },
                {
                  label: 'Highest Match',
                  value: candidates.length > 0
                    ? `${Math.max(...candidates.map(c => c.score ?? c.rankingScore ?? 0))}%`
                    : '0%',
                },
                {
                  label: 'Unique Skills',
                  value: [...new Set(candidates.flatMap(c => c.skills || []))].length,
                },
                {
                  label: 'Total Resumes',
                  value: `${candidates.length} processed`,
                },
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
        </>
      )}
    </div>
  );
}
