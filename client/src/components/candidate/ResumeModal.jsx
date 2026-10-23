import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  XCircle,
  Loader2,
} from 'lucide-react';
import api from '../../api';
import { getScoreColor, getInitials } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';

export default function ResumeModal({ candidate, isOpen, onClose, onStatusChange }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const candidateId = candidate?._id || candidate?.id;

  useEffect(() => {
    if (!isOpen || !candidateId) {
      setBlobUrl(null);
      setError(null);
      return;
    }

    let activeUrl = null;
    let isCancelled = false;

    async function fetchPdf() {
      setLoading(true);
      setError(null);
      try {
        const blob = await api.getBlob(`/resumes/${candidateId}`);
        if (!isCancelled) {
          activeUrl = URL.createObjectURL(blob);
          setBlobUrl(activeUrl);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Resume PDF not found in database');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchPdf();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCancelled = true;
      window.removeEventListener('keydown', handleKeyDown);
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [isOpen, candidateId, onClose]);

  if (!isOpen || !candidate) return null;

  const fName = candidate.firstName || candidate.name?.split(' ')[0] || '';
  const lName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
  const scoreVal = candidate.score ?? candidate.rankingScore ?? 0;
  const breakdown = candidate.scoreBreakdown;
  const currentStatus = (candidate.status || 'Pending').toLowerCase();

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = candidate.resumeFile || `${candidate.name || 'Candidate'}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-surface-950/70 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-surface-200/80 dark:border-surface-750 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="h-16 px-6 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between flex-shrink-0 bg-surface-50/50 dark:bg-surface-850/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(fName, lName)}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-surface-900 dark:text-white truncate">
                    {candidate.name || `${fName} ${lName}`}
                  </h3>
                  <StatusBadge status={candidate.status} size="xs" />
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                  {candidate.email} {candidate.location ? `· ${candidate.location}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {blobUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body - 2 Column Split */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: PDF Viewer (7 cols) */}
            <div className="lg:col-span-7 h-full bg-surface-100 dark:bg-surface-950 p-3 sm:p-4 flex flex-col justify-center items-center overflow-hidden border-b lg:border-b-0 lg:border-r border-surface-200 dark:border-surface-800">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-surface-500">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                  <p className="text-xs font-medium">Streaming resume from database...</p>
                </div>
              ) : error ? (
                <div className="max-w-sm text-center p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-surface-900 dark:text-white mb-1">Resume Not Available</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-3">{error}</p>
                  <p className="text-[11px] text-surface-400">PDF resumes uploaded via the new system are stored securely in MongoDB.</p>
                </div>
              ) : blobUrl ? (
                <iframe
                  src={`${blobUrl}#toolbar=0`}
                  title={`${candidate.name} Resume`}
                  className="w-full h-full rounded-2xl shadow-inner border border-surface-200 dark:border-surface-800 bg-white"
                />
              ) : (
                <div className="text-center text-surface-400 text-xs">No PDF preview available</div>
              )}
            </div>

            {/* Right Column: Parsed Details & Scoring Breakdown (5 cols) */}
            <div className="lg:col-span-5 h-full overflow-y-auto p-5 sm:p-6 space-y-5 bg-white dark:bg-surface-900">
              {/* Score & Profile match card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-transparent border border-brand-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Match Score
                  </span>
                  <span className={`text-2xl font-black ${getScoreColor(scoreVal)}`}>
                    {scoreVal}%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full gradient-brand transition-all duration-500"
                    style={{ width: `${scoreVal}%` }}
                  />
                </div>
                {breakdown?.jobProfileTitle && (
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">
                    Target Profile: <span className="font-semibold text-surface-700 dark:text-surface-300">{breakdown.jobProfileTitle}</span>
                  </p>
                )}
                {breakdown?.missingMandatory && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1">
                    ⚠️ Missing mandatory skills (score capped at 50)
                  </p>
                )}
              </div>

              {/* Status Action Buttons */}
              <div>
                <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
                  Application Decision
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onStatusChange?.(candidateId, 'Shortlisted')}
                    disabled={currentStatus === 'shortlisted'}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'shortlisted'
                        ? 'bg-emerald-500 text-white opacity-90 cursor-default shadow-sm'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border border-emerald-500/20'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Shortlist
                  </button>
                  <button
                    onClick={() => onStatusChange?.(candidateId, 'In Review')}
                    disabled={currentStatus === 'review' || currentStatus === 'in review'}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'review' || currentStatus === 'in review'
                        ? 'bg-amber-500 text-white opacity-90 cursor-default shadow-sm'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50 border border-amber-500/20'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                  <button
                    onClick={() => onStatusChange?.(candidateId, 'Rejected')}
                    disabled={currentStatus === 'rejected'}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'rejected'
                        ? 'bg-rose-500 text-white opacity-90 cursor-default shadow-sm'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-500/20'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>

              {/* Skills Breakdown: Matched vs Missing */}
              {breakdown && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Matched Required Skills</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        {breakdown.matchedSkills?.length || 0} matched
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {breakdown.matchedSkills?.length > 0 ? (
                        breakdown.matchedSkills.map((sk, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30"
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {sk.name}
                            <span className="text-[10px] opacity-60">w:{sk.weight}</span>
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-surface-400 italic">No required skills matched</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Missing Required Skills</span>
                      <span className="text-rose-600 dark:text-rose-400 text-xs font-semibold">
                        {breakdown.missingSkills?.length || 0} missing
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {breakdown.missingSkills?.length > 0 ? (
                        breakdown.missingSkills.map((sk, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-500/30"
                          >
                            <XCircle className="w-3 h-3 text-rose-500" />
                            {sk.name}
                            {sk.mandatory && (
                              <span className="px-1 py-0.2 text-[9px] rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
                                Req
                              </span>
                            )}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          All required skills present!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* All Extracted Skills */}
              <div>
                <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
                  All Candidate Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg text-xs bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-200 dark:border-surface-800">
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Experience
                  </span>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mt-1">
                    {candidate.experienceYears ? `${candidate.experienceYears} Years` : 'Not specified'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Education
                  </span>
                  <p className="text-xs font-semibold text-surface-900 dark:text-white mt-1 line-clamp-2">
                    {typeof candidate.education === 'string' && candidate.education
                      ? candidate.education
                      : 'Graduate'}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {candidate.summary && (
                <div>
                  <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
                    Professional Summary
                  </p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed bg-surface-50 dark:bg-surface-800/30 p-3 rounded-xl border border-surface-200/50 dark:border-surface-750">
                    {candidate.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
