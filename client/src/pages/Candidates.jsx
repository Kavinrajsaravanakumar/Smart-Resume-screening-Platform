import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import CandidateTable from '../components/tables/CandidateTable.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import { mockCandidates } from '../data/mockCandidates.js';

const ITEMS_PER_PAGE = 8;

export default function Candidates() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...candidates];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email} ${c.skills?.join(' ')}`.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    return result;
  }, [candidates, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const statusCounts = useMemo(() => ({
    all: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    review: candidates.filter(c => c.status === 'review').length,
    pending: candidates.filter(c => c.status === 'pending').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
  }), [candidates]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description={`${filtered.length} total candidates`}
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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
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
        {paginated.length > 0 ? (
          <>
            <CandidateTable
              candidates={paginated}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
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
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No candidates found</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
