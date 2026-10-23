import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Upload, Users, AlertCircle, Loader2 } from 'lucide-react';
import CandidateTable from '../components/tables/CandidateTable.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import ResumeModal from '../components/candidate/ResumeModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api.js';

const ITEMS_PER_PAGE = 8;

export default function Candidates() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resume Modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/candidates');
      if (res?.data && Array.isArray(res.data)) {
        setCandidates(res.data);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError(err.message || 'Failed to load candidates from server');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filtered = useMemo(() => {
    let result = [...candidates];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => {
        const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`;
        return `${fullName} ${c.email} ${c.location || ''} ${c.skills?.join(' ')}`.toLowerCase().includes(q);
      });
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => {
        const s = (c.status || '').toLowerCase();
        if (statusFilter === 'review') return s === 'review' || s === 'in review';
        return s === statusFilter;
      });
    }
    return result;
  }, [candidates, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    const candidateToDelete = candidates.find(c => (c.id === id || c._id === id));
    const previous = [...candidates];
    // Optimistic removal
    setCandidates(prev => prev.filter(c => c.id !== id && c._id !== id));

    try {
      await api.delete(`/candidates/${id}`);
      toast.success(`${candidateToDelete?.name || 'Candidate'} deleted successfully`);
    } catch (err) {
      setCandidates(previous);
      toast.error(err.message || 'Failed to delete candidate');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const candidateToUpdate = candidates.find(c => (c.id === id || c._id === id));
    const previousStatus = candidateToUpdate?.status;

    // Optimistic status update
    setCandidates(prev =>
      prev.map(c => ((c.id === id || c._id === id) ? { ...c, status: newStatus } : c))
    );

    // Also update selectedCandidate inside modal if it's currently open
    if (selectedCandidate && (selectedCandidate.id === id || selectedCandidate._id === id)) {
      setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
    }

    try {
      await api.patch(`/candidates/${id}/status`, { status: newStatus });
      toast.success(`Updated ${candidateToUpdate?.name || 'Candidate'} to "${newStatus}"`);
    } catch (err) {
      // Revert on failure
      setCandidates(prev =>
        prev.map(c => ((c.id === id || c._id === id) ? { ...c, status: previousStatus } : c))
      );
      toast.error(err.message || 'Failed to update candidate status');
    }
  };

  const handleViewResume = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const statusCounts = useMemo(() => ({
    all: candidates.length,
    shortlisted: candidates.filter(c => (c.status || '').toLowerCase() === 'shortlisted').length,
    review: candidates.filter(c => (c.status || '').toLowerCase() === 'review' || (c.status || '').toLowerCase() === 'in review').length,
    pending: candidates.filter(c => (c.status || '').toLowerCase() === 'pending').length,
    rejected: candidates.filter(c => (c.status || '').toLowerCase() === 'rejected').length,
  }), [candidates]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description={`${filtered.length} candidate${filtered.length === 1 ? '' : 's'} in pipeline`}
        action={
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </Link>
        }
      />

      <GlassCard className="p-4" hover={false}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name, email, location, or skill..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'shortlisted', 'review', 'pending', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1 opacity-60">{statusCounts[status]}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden" hover={false}>
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-surface-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            <p className="text-sm font-medium">Loading candidate roster...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <p className="text-base font-bold text-surface-900 dark:text-white mb-1">Failed to load candidates</p>
            <p className="text-xs text-surface-500 mb-4">{error}</p>
            <button
              onClick={loadCandidates}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : candidates.length === 0 ? (
          /* Empty state when no candidates have been uploaded yet */
          <div className="p-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
              No candidates yet
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
              No candidates yet. Upload a resume to get started. The AI engine will parse the candidate profile and evaluate their match score against your active job profile.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
            >
              <Upload className="w-4 h-4" /> Upload Resume
            </Link>
          </div>
        ) : paginated.length > 0 ? (
          <>
            <CandidateTable
              candidates={paginated}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onViewResume={handleViewResume}
            />
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200/50 dark:border-surface-700/50">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        page === i + 1
                          ? 'bg-brand-500 text-white'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Filter search returned 0 items */
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
            <p className="text-base font-bold text-surface-900 dark:text-white mb-1">No matching candidates found</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">Try adjusting your search criteria or status filter.</p>
          </div>
        )}
      </GlassCard>

      {/* Resume Viewer & Scoring Breakdown Modal */}
      <ResumeModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
