import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, ZoomIn, ZoomOut, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api.js';

export default function ResumePreview() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCandidate() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/candidates/${id}`);
        if (res?.data) {
          setCandidate(res.data);
        } else {
          setError('Candidate not found');
        }
      } catch (err) {
        console.error('ResumePreview fetch error:', err);
        setError(err.message || 'Failed to load candidate');
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [id]);

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
      alert('Could not download resume: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-surface-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm font-medium">Loading candidate preview...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <FileText className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Candidate Not Found</h2>
        <Link to="/candidates" className="text-brand-600 dark:text-brand-400 hover:underline text-sm">Back to Candidates</Link>
      </div>
    );
  }

  const fName = candidate.firstName || candidate.name?.split(' ')[0] || '';
  const lName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
  const candId = candidate.id || candidate._id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to={`/candidates/${candId}`}
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 no-underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Details
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(50, z - 10))}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-surface-500 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(200, z + 10))}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl shadow-soft-lg overflow-hidden"
      >
        <div className="bg-white dark:bg-surface-800 p-8" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
          <div className="max-w-[700px] mx-auto space-y-6">
            <div className="text-center border-b border-surface-200 dark:border-surface-700 pb-6">
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
                {candidate.name || `${fName} ${lName}`}
              </h1>
              {candidate.summary && <p className="text-surface-600 dark:text-surface-300 mb-3">{candidate.summary}</p>}
              <div className="flex items-center justify-center gap-4 text-sm text-surface-500">
                <span>{candidate.email}</span>
                {candidate.phone && (
                  <>
                    <span>|</span>
                    <span>{candidate.phone}</span>
                  </>
                )}
                {candidate.location && (
                  <>
                    <span>|</span>
                    <span>{candidate.location}</span>
                  </>
                )}
              </div>
            </div>

            <section>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-3 pb-1 border-b border-surface-200 dark:border-surface-700">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map(skill => (
                  <span key={skill} className="px-2.5 py-1 text-xs rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {candidate.experienceYears > 0 && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2 pb-1 border-b border-surface-200 dark:border-surface-700">Experience</h2>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  {candidate.experienceYears} Years of Industry Experience
                </p>
                {Array.isArray(candidate.experience) && candidate.experience.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {candidate.experience.map((exp, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="font-semibold text-surface-900 dark:text-white text-sm">{exp.role || exp.title}</p>
                          <span className="text-xs text-surface-400">{exp.duration}</span>
                        </div>
                        <p className="text-brand-600 dark:text-brand-400 text-xs mb-1">{exp.company}</p>
                        {exp.description && <p className="text-xs text-surface-600 dark:text-surface-400">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {candidate.education && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2 pb-1 border-b border-surface-200 dark:border-surface-700">Education</h2>
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {typeof candidate.education === 'string' ? candidate.education : 'Graduate Degree'}
                </p>
              </section>
            )}

            {Array.isArray(candidate.projects) && candidate.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-3 pb-1 border-b border-surface-200 dark:border-surface-700">Projects</h2>
                <div className="space-y-2.5">
                  {candidate.projects.map((proj, i) => (
                    <div key={i}>
                      <p className="font-semibold text-surface-900 dark:text-white text-sm">{proj.name}</p>
                      {proj.description && <p className="text-xs text-surface-600 dark:text-surface-400">{proj.description}</p>}
                      {proj.tech && <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">Tech: {proj.tech}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(candidate.certifications) && candidate.certifications.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-3 pb-1 border-b border-surface-200 dark:border-surface-700">Certifications</h2>
                <ul className="list-disc list-inside text-xs text-surface-600 dark:text-surface-400 space-y-1">
                  {candidate.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
