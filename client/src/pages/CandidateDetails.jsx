import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  FolderOpen,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import ResumeModal from '../components/candidate/ResumeModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getScoreColor, getInitials } from '../utils/formatters.js';
import { useState, useEffect } from 'react';
import api from '../api.js';

export default function CandidateDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/candidates/${id}`);
        if (res?.data) {
          setCandidate(res.data);
        } else {
          setError('Candidate details not found');
        }
      } catch (err) {
        console.error('Candidate fetch error:', err);
        setError(err.message || 'Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [id]);

  const handleStatusChange = async (targetId, newStatus) => {
    if (!candidate) return;
    const previousStatus = candidate.status;

    // Optimistic update
    setCandidate(prev => ({ ...prev, status: newStatus }));

    try {
      await api.patch(`/candidates/${targetId}/status`, { status: newStatus });
      toast.success(`Candidate status updated to "${newStatus}"`);
    } catch (err) {
      setCandidate(prev => ({ ...prev, status: previousStatus }));
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await api.getBlob(`/resumes/${id}`);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = candidate?.resumeFile || `${candidate?.name || 'Candidate'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error(err.message || 'Could not download resume PDF');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-surface-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm font-medium">Loading candidate profile...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <FileText className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Candidate Not Found</h2>
        <p className="text-xs text-surface-500 mb-6">{error || 'This candidate may have been removed or does not exist.'}</p>
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-semibold no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidates
        </Link>
      </div>
    );
  }

  const fName = candidate.firstName || candidate.name?.split(' ')[0] || '';
  const lName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
  const scoreVal = candidate.score ?? candidate.rankingScore ?? 0;
  const breakdown = candidate.scoreBreakdown;
  const currentStatus = (candidate.status || 'Pending').toLowerCase();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/candidates"
            className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 no-underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Candidates
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-semibold shadow-glass hover:shadow-glass-lg transition-shadow"
          >
            <Eye className="w-4 h-4" /> View Resume PDF
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column (1/3) */}
          <div className="lg:w-1/3 space-y-4">
            <GlassCard className="p-6" hover={false}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glass">
                  {getInitials(fName, lName)}
                </div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
                  {candidate.name || `${fName} ${lName}`}
                </h2>
                {candidate.summary && (
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 leading-relaxed">
                    {candidate.summary}
                  </p>
                )}
                <StatusBadge status={candidate.status} size="md" />
              </div>

              {/* Contact info */}
              <div className="space-y-2.5 mb-6 pt-4 border-t border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center gap-3 text-xs">
                  <Mail className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="text-surface-600 dark:text-surface-300 truncate">{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-3 text-xs">
                    <Phone className="w-4 h-4 text-surface-400 flex-shrink-0" />
                    <span className="text-surface-600 dark:text-surface-300">{candidate.phone}</span>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="w-4 h-4 text-surface-400 flex-shrink-0" />
                    <span className="text-surface-600 dark:text-surface-300">{candidate.location}</span>
                  </div>
                )}
              </div>

              {/* Status Decision Buttons */}
              <div className="mb-6">
                <p className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-2">
                  Application Decision
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleStatusChange(id, 'Shortlisted')}
                    disabled={currentStatus === 'shortlisted'}
                    className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'shortlisted'
                        ? 'bg-emerald-500 text-white shadow-sm cursor-default'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Shortlist
                  </button>
                  <button
                    onClick={() => handleStatusChange(id, 'In Review')}
                    disabled={currentStatus === 'review' || currentStatus === 'in review'}
                    className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'review' || currentStatus === 'in review'
                        ? 'bg-amber-500 text-white shadow-sm cursor-default'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(id, 'Rejected')}
                    disabled={currentStatus === 'rejected'}
                    className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === 'rejected'
                        ? 'bg-rose-500 text-white shadow-sm cursor-default'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>

              {/* Resume Score box */}
              <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-surface-500 dark:text-surface-400">Match Score</span>
                  <span className={`text-xl font-black ${getScoreColor(scoreVal)}`}>
                    {scoreVal}%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-brand"
                    style={{ width: `${scoreVal}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-glass hover:shadow-glass-lg transition-shadow"
                >
                  <Eye className="w-4 h-4" /> View Resume
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-xs font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </GlassCard>

            {/* Certifications Card */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">Certifications</h3>
              </div>
              {Array.isArray(candidate.certifications) && candidate.certifications.length > 0 ? (
                <div className="space-y-1.5">
                  {candidate.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-xs text-surface-700 dark:text-surface-300">
                      <Star className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-surface-400 italic">No certifications listed</p>
              )}
            </GlassCard>
          </div>

          {/* Right Column (2/3) */}
          <div className="lg:w-2/3 space-y-4">
            {/* Score Breakdown Section */}
            {breakdown && (
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white">
                      Skill-Based Scoring Breakdown
                    </h3>
                  </div>
                  {breakdown.jobProfileTitle && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium">
                      Profile: {breakdown.jobProfileTitle}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
                    <p className="text-[10px] text-surface-400 font-medium uppercase">Skills Component</p>
                    <p className="text-lg font-bold text-surface-900 dark:text-white mt-0.5">{breakdown.skillsScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
                    <p className="text-[10px] text-surface-400 font-medium uppercase">Experience Match</p>
                    <p className="text-lg font-bold text-surface-900 dark:text-white mt-0.5">{breakdown.experienceScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
                    <p className="text-[10px] text-surface-400 font-medium uppercase">Education Level</p>
                    <p className="text-lg font-bold text-surface-900 dark:text-white mt-0.5">{breakdown.educationScore}%</p>
                  </div>
                </div>

                {/* Matched Required Skills (Green Chips) */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Matched Required Skills ({breakdown.matchedSkills?.length || 0})
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
                          <span className="text-[10px] opacity-60">weight:{sk.weight}</span>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-surface-400 italic">None of the required profile skills were matched</p>
                    )}
                  </div>
                </div>

                {/* Missing Required Skills (Red Chips) */}
                <div>
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Missing Required Skills ({breakdown.missingSkills?.length || 0})
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
                              Mandatory
                            </span>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">All profile requirements met!</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Extracted Skills */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">All Extracted Skills</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Experience Card */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">Work Experience</h3>
              </div>
              <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mb-2">
                Total Calculated: {candidate.experienceYears ? `${candidate.experienceYears} Years` : '0 Years'}
              </p>
              {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
                <div className="space-y-3">
                  {candidate.experience.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/50 dark:border-surface-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-surface-900 dark:text-white">{exp.role || exp.title}</p>
                        <span className="text-[11px] text-surface-400">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-brand-600 font-medium mb-1">{exp.company}</p>
                      {exp.description && <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-surface-400 italic">No detailed employment timeline extracted</p>
              )}
            </GlassCard>

            {/* Education Card */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">Education</h3>
              </div>
              <p className="text-xs text-surface-700 dark:text-surface-300">
                {typeof candidate.education === 'string' && candidate.education
                  ? candidate.education
                  : 'Higher Education'}
              </p>
            </GlassCard>

            {/* Projects Card */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">Projects</h3>
              </div>
              {Array.isArray(candidate.projects) && candidate.projects.length > 0 ? (
                <div className="space-y-3">
                  {candidate.projects.map((proj, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/50 dark:border-surface-700/50">
                      <p className="text-xs font-bold text-surface-900 dark:text-white mb-0.5">{proj.name}</p>
                      {proj.description && <p className="text-xs text-surface-600 dark:text-surface-400 mb-1 leading-relaxed">{proj.description}</p>}
                      {proj.tech && <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Tech: {proj.tech}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-surface-400 italic">No key projects listed</p>
              )}
            </GlassCard>
          </div>
        </div>
      </motion.div>

      {/* Embedded Resume Modal */}
      <ResumeModal
        candidate={candidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
