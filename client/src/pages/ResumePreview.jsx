import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { mockCandidates } from '../data/mockCandidates.js';

export default function ResumePreview() {
  const { id } = useParams();
  const candidate = mockCandidates.find(c => c.id === id);
  const [zoom, setZoom] = useState(100);

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Candidate Not Found</h2>
        <Link to="/candidates" className="text-brand-600 dark:text-brand-400 hover:underline text-sm">Back to Candidates</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to={`/candidates/${id}`}
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glass hover:shadow-glass-lg transition-shadow">
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
            <div className="text-center border-b border-surface-200 pb-6">
              <h1 className="text-3xl font-bold text-surface-900 mb-2">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="text-surface-600 mb-3">{candidate.summary}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-surface-500">
                <span>{candidate.email}</span>
                <span>|</span>
                <span>{candidate.phone}</span>
              </div>
            </div>

            <section>
              <h2 className="text-lg font-bold text-surface-900 mb-3 pb-1 border-b border-surface-200">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map(skill => (
                  <span key={skill} className="px-2 py-1 text-sm rounded bg-brand-50 text-brand-700 border border-brand-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-surface-900 mb-3 pb-1 border-b border-surface-200">Experience</h2>
              {candidate.experience?.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="font-semibold text-surface-900">{exp.role}</p>
                    <span className="text-xs text-surface-500">{exp.duration}</span>
                  </div>
                  <p className="text-brand-600 text-sm mb-1">{exp.company}</p>
                  <p className="text-sm text-surface-600">{exp.description}</p>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-lg font-bold text-surface-900 mb-3 pb-1 border-b border-surface-200">Education</h2>
              {candidate.education?.map((edu, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-surface-900">{edu.degree}</p>
                  <p className="text-brand-600 text-sm">{edu.institution} · {edu.year}</p>
                  {edu.gpa && <p className="text-xs text-surface-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>

            {candidate.projects?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 mb-3 pb-1 border-b border-surface-200">Projects</h2>
                {candidate.projects?.map((proj, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold text-surface-900">{proj.name}</p>
                    <p className="text-sm text-surface-600">{proj.description}</p>
                    <p className="text-xs text-surface-500 mt-1">Tech: {proj.tech}</p>
                  </div>
                ))}
              </section>
            )}

            {candidate.certifications?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-surface-900 mb-3 pb-1 border-b border-surface-200">Certifications</h2>
                <ul className="list-disc list-inside text-sm text-surface-600">
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
