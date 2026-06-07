import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2 } from 'lucide-react';
import { deleteCandidate, fetchCandidates } from '../api/candidates';
import LoadingState from '../components/LoadingState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const defaultFilters = {
  search: '',
  skills: '',
  education: '',
  minExperience: '',
  minScore: ''
};

export default function CandidateList() {
  const [filters, setFilters] = useState(defaultFilters);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  useEffect(() => {
    async function loadCandidates() {
      setLoading(true);
      const result = await fetchCandidates(params);
      setCandidates(result.data);
      setLoading(false);
    }

    loadCandidates();
  }, [params]);

  async function handleDelete(id) {
    await deleteCandidate(id);
    setCandidates((items) => items.filter((candidate) => candidate.candidateId !== id));
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Recruiter workspace</p>
        <h1>Candidate List</h1>
        <p>Search, filter, and review ranked candidates.</p>
      </header>

      <div className="filters">
        <label className="field search-field">
          <span>Search</span>
          <div className="input-icon">
            <Search size={17} />
            <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Name, email, skill" />
          </div>
        </label>
        <label className="field">
          <span>Skills</span>
          <input value={filters.skills} onChange={(event) => setFilters({ ...filters, skills: event.target.value })} placeholder="AWS, Java" />
        </label>
        <label className="field">
          <span>Education</span>
          <input value={filters.education} onChange={(event) => setFilters({ ...filters, education: event.target.value })} placeholder="B.Tech" />
        </label>
        <label className="field">
          <span>Experience</span>
          <input type="number" min="0" value={filters.minExperience} onChange={(event) => setFilters({ ...filters, minExperience: event.target.value })} placeholder="Years" />
        </label>
        <label className="field">
          <span>Min score</span>
          <input type="number" min="0" max="100" value={filters.minScore} onChange={(event) => setFilters({ ...filters, minScore: event.target.value })} placeholder="70" />
        </label>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="candidate-table-wrap">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Education</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.candidateId}>
                  <td>
                    <Link to={`/candidates/${candidate.candidateId}`}>{candidate.fullName || candidate.name}</Link>
                    <span>{candidate.email}</span>
                  </td>
                  <td>{candidate.skills.join(', ')}</td>
                  <td>{candidate.experience} years</td>
                  <td>{candidate.education}</td>
                  <td><StatusBadge score={candidate.rankingScore} /></td>
                  <td>
                    <button className="icon-button danger" aria-label={`Delete ${candidate.name}`} onClick={() => handleDelete(candidate.candidateId)}>
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {!candidates.length && (
                <tr>
                  <td colSpan="6" className="empty-cell">No candidates match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
