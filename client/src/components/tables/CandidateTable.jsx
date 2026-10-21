import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge.jsx';
import { formatDate, getScoreColor, getInitials } from '../../utils/formatters.js';

export default function CandidateTable({ candidates, onDelete, onStatusChange }) {
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
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const statusOptions = ['shortlisted', 'review', 'pending', 'rejected'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
            {[
              { key: 'firstName', label: 'Candidate' },
              { key: 'email', label: 'Email' },
              { key: 'rankingScore', label: 'Score' },
              { key: 'status', label: 'Status' },
              { key: 'createdAt', label: 'Applied' },
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
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sorted.map((candidate, i) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <Link to={`/candidates/${candidate.id}`} className="flex items-center gap-3 no-underline">
                    <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials(candidate.firstName, candidate.lastName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {candidate.skills?.slice(0, 3).join(', ')}
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
                        style={{ width: `${candidate.rankingScore}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(candidate.rankingScore)}`}>
                      {candidate.rankingScore}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={candidate.status} size="xs" />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-surface-500 dark:text-surface-400">{formatDate(candidate.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === candidate.id ? null : candidate.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {openMenu === candidate.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-full mt-1 w-48 glass-strong rounded-xl shadow-soft-lg border border-surface-200/50 dark:border-surface-700/50 py-1 z-50"
                        >
                          <Link
                            to={`/candidates/${candidate.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline"
                            onClick={() => setOpenMenu(null)}
                          >
                            <ExternalLink className="w-4 h-4" /> View Details
                          </Link>
                          {statusOptions.map(s => (
                            <button
                              key={s}
                              onClick={() => { onStatusChange?.(candidate.id, s); setOpenMenu(null); }}
                              className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ${
                                candidate.status === s ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-surface-700 dark:text-surface-300'
                              }`}
                            >
                              Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                          <div className="border-t border-surface-200/50 dark:border-surface-700/50 my-1" />
                          <button
                            onClick={() => { onDelete?.(candidate.id); setOpenMenu(null); }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
