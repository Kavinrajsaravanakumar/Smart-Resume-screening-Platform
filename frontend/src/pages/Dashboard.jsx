import { useEffect, useState } from 'react';
import { Award, Ban, Clock, Gauge, Star, Users } from 'lucide-react';
import { fetchDashboardStats } from '../api/candidates';
import LoadingState from '../components/LoadingState.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats()
      .then((result) => setStats(result.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard stats.'));
  }, []);

  if (error) return <div className="upload-status error">{error}</div>;
  if (!stats) return <LoadingState label="Loading dashboard" />;

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">HR Dashboard</p>
        <h1>Screening Overview</h1>
        <p>Monitor hiring pipeline quality, recent resume intake, and top candidate matches.</p>
      </header>

      <div className="stats-grid">
        <StatCard title="Total candidates" value={stats.totalCandidates} detail="Profiles stored" icon={Users} />
        <StatCard title="Shortlisted" value={stats.shortlistedCandidates} detail="Score above 75%" icon={Award} />
        <StatCard title="Rejected" value={stats.rejectedCandidates} detail="Score below 40%" icon={Ban} />
        <StatCard title="Average score" value={`${stats.averageScore}%`} detail="Across candidates" icon={Gauge} />
        <StatCard title="Top skills" value={stats.topSkills.length} detail="Most common detected" icon={Star} />
        <StatCard title="Recent uploads" value={stats.recentUploads.length} detail="Latest resumes" icon={Clock} />
      </div>

      <div className="dashboard-grid">
        <section>
          <h2>Top candidates</h2>
          <div className="stack-list">
            {stats.topCandidates.map((candidate) => (
              <article className="mini-row" key={candidate.candidateId}>
                <div>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.skills.join(', ')}</span>
                </div>
                <StatusBadge score={candidate.rankingScore} />
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2>Recent uploads</h2>
          <div className="stack-list">
            {stats.recentUploads.map((candidate) => (
              <article className="mini-row" key={candidate.candidateId}>
                <div>
                  <strong>{candidate.name}</strong>
                  <span>{new Date(candidate.createdAt).toLocaleString()}</span>
                </div>
                <StatusBadge score={candidate.rankingScore} />
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2>Top skills</h2>
          <div className="stack-list">
            {stats.topSkills.map((item) => (
              <article className="mini-row" key={item.skill}>
                <div>
                  <strong>{item.skill}</strong>
                  <span>{item.count} candidate{item.count === 1 ? '' : 's'}</span>
                </div>
              </article>
            ))}
            {!stats.topSkills.length && <p className="empty-state">No skills detected yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
