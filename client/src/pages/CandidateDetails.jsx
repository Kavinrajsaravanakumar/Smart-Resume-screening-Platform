import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  FolderOpen,
  Star,
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import SkillTags from '../components/candidate/CandidateProfile.jsx';
import {
  InfoSection,
  ExperienceCard,
  EducationCard,
  ProjectCard,
} from '../components/candidate/CandidateProfile.jsx';
import { mockCandidates } from '../data/mockCandidates.js';
import { getScoreColor, getInitials } from '../utils/formatters.js';

export default function CandidateDetails() {
  const { id } = useParams();
  const candidate = mockCandidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Candidate Not Found</h2>
        <Link to="/candidates" className="text-brand-600 dark:text-brand-400 hover:underline text-sm">
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-4 no-underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 space-y-4">
            <GlassCard className="p-6" hover={false}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glass">
                  {getInitials(candidate.firstName, candidate.lastName)}
                </div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">{candidate.summary}</p>
                <StatusBadge status={candidate.status} size="md" />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-surface-400" />
                  <span className="text-surface-600 dark:text-surface-400">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-surface-400" />
                  <span className="text-surface-600 dark:text-surface-400">{candidate.phone}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 mb-4">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Resume Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.rankingScore}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                    />
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(candidate.rankingScore)}`}>
                    {candidate.rankingScore}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/candidates/${candidate.id}/resume`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow no-underline"
                >
                  <FileText className="w-4 h-4" /> View Resume
                </Link>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={Award} title="Certifications">
                {candidate.certifications?.length > 0 ? (
                  <div className="space-y-2">
                    {candidate.certifications.map((cert, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                        <Star className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-surface-700 dark:text-surface-300">{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-surface-400">No certifications listed</p>
                )}
              </InfoSection>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={Star} title="Achievements">
                {candidate.achievements?.length > 0 ? (
                  <div className="space-y-2">
                    {candidate.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                        <Award className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-surface-700 dark:text-surface-300">{ach}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-surface-400">No achievements listed</p>
                )}
              </InfoSection>
            </GlassCard>
          </div>

          <div className="lg:w-2/3 space-y-4">
            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={Award} title="Skills">
                <SkillTags skills={candidate.skills} />
              </InfoSection>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={Briefcase} title="Experience">
                <div className="space-y-3">
                  {candidate.experience?.map((exp, i) => (
                    <ExperienceCard key={i} experience={exp} />
                  ))}
                </div>
              </InfoSection>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={GraduationCap} title="Education">
                <div className="space-y-3">
                  {candidate.education?.map((edu, i) => (
                    <EducationCard key={i} education={edu} />
                  ))}
                </div>
              </InfoSection>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <InfoSection icon={FolderOpen} title="Projects">
                <div className="space-y-3">
                  {candidate.projects?.map((proj, i) => (
                    <ProjectCard key={i} project={proj} />
                  ))}
                </div>
              </InfoSection>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
