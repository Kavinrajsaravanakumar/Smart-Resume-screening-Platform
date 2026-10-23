import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MoreVertical,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge.jsx';
import { formatDate, getScoreColor, getInitials } from '../../utils/formatters.js';

export default function CandidateTable({ candidates, onDelete, onStatusChange, onViewResume }) {
  const [sortField, setSortField] = useState('rankingScore');
  const [sortDir, setSortDir] = useState('desc');
  const [openMenu, setOpenMenu] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...candidates].sort((a, b) => {
    const aVal = a[sortField] ?? (sortField === 'rankingScore' ? a.score : 0) ?? '';
    const bVal = b[sortField] ?? (sortField === 'rankingScore' ? b.score : 0) ?? '';
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
            {[
              { key: 'name', label: 'Candidate' },
              { key: 'email', label: 'Email' },
              { key: 'rankingScore', label: 'Match Score' },
              { key: 'status', label: 'Status' },
              { key: 'appliedAt', label: 'Applied' },
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-surface-700 dark:hover:text-surface-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  {label}
                  <SortIcon field={key} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sorted.map((candidate, i) => {
              const candId = candidate.id || candidate._id;
              const fName = candidate.firstName || candidate.name?.split(' ')[0] || '';
              const lName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
              const scoreVal = candidate.score ?? candidate.rankingScore ?? 0;
              const currentStatus = (candidate.status || 'Pending').toLowerCase();

              return (
                <motion.tr
                  key={candId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <Link to={`/candidates/${candId}`} className="flex items-center gap-3 no-underline">
                      <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(fName, lName)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {candidate.name || `${fName} ${lName}`}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-xs">
                          {candidate.skills?.slice(0, 3).join(', ')}
                          {candidate.location ? ` · ${candidate.location}` : ''}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-surface-600 dark:text-surface-400">{candidate.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                          style={{ width: `${scoreVal}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(scoreVal)}`}>
                        {scoreVal}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={candidate.status} size="xs" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      {formatDate(candidate.appliedAt || candidate.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Resume Eye Button */}
                      <button
                        onClick={() => onViewResume?.(candidate)}
                        title="View Resume & Score Breakdown"
                        className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === candId ? null : candId)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {openMenu === candId && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 top-full mt-1 w-52 glass-strong rounded-2xl shadow-soft-xl border border-surface-200/80 dark:border-surface-700/80 py-1.5 z-50 text-left bg-white/95 dark:bg-surface-900/95"
                            >
                              <button
                                onClick={() => {
                                  onViewResume?.(candidate);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                              >
                                <Eye className="w-4 h-4 text-brand-500" /> View Resume
                              </button>
                              <Link
                                to={`/candidates/${candId}`}
                                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <ExternalLink className="w-4 h-4 text-surface-400" /> Full Candidate Profile
                              </Link>

                              <div className="border-t border-surface-200/50 dark:border-surface-700/50 my-1" />

                              <p className="px-3.5 py-1 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                Change Status
                              </p>

                              <button
                                disabled={currentStatus === 'shortlisted'}
                                onClick={() => {
                                  onStatusChange?.(candId, 'Shortlisted');
                                  setOpenMenu(null);
                                }}
                                className={`w-full text-left flex items-center gap-2 px-3.5 py-1.5 text-xs transition-colors ${
                                  currentStatus === 'shortlisted'
                                    ? 'text-emerald-500 font-bold opacity-60 cursor-default'
                                    : 'text-surface-700 dark:text-surface-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Shortlist
                              </button>

                              <button
                                disabled={currentStatus === 'review' || currentStatus === 'in review'}
                                onClick={() => {
                                  onStatusChange?.(candId, 'In Review');
                                  setOpenMenu(null);
                                }}
                                className={`w-full text-left flex items-center gap-2 px-3.5 py-1.5 text-xs transition-colors ${
                                  currentStatus === 'review' || currentStatus === 'in review'
                                    ? 'text-amber-500 font-bold opacity-60 cursor-default'
                                    : 'text-surface-700 dark:text-surface-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> Move to Review
                              </button>

                              <button
                                disabled={currentStatus === 'rejected'}
                                onClick={() => {
                                  onStatusChange?.(candId, 'Rejected');
                                  setOpenMenu(null);
                                }}
                                className={`w-full text-left flex items-center gap-2 px-3.5 py-1.5 text-xs transition-colors ${
                                  currentStatus === 'rejected'
                                    ? 'text-rose-500 font-bold opacity-60 cursor-default'
                                    : 'text-surface-700 dark:text-surface-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Reject
                              </button>

                              <div className="border-t border-surface-200/50 dark:border-surface-700/50 my-1" />

                              <button
                                onClick={() => {
                                  onDelete?.(candId);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left flex items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Candidate
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
