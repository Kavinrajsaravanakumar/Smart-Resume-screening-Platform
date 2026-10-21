import { motion } from 'framer-motion';


export default function SkillTags({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <motion.span
          key={skill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          className="px-3 py-1.5 text-xs font-medium rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors cursor-default"
        >
          {skill}
        </motion.span>
      ))}
    </div>
  );
}

export function InfoSection({ icon: Icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ExperienceCard({ experience }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{experience.role}</p>
          <p className="text-sm text-brand-600 dark:text-brand-400">{experience.company}</p>
        </div>
        <span className="text-xs text-surface-500 dark:text-surface-400 whitespace-nowrap">{experience.duration}</span>
      </div>
      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{experience.description}</p>
    </motion.div>
  );
}

export function EducationCard({ education }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
    >
      <p className="text-sm font-semibold text-surface-900 dark:text-white">{education.degree}</p>
      <p className="text-sm text-brand-600 dark:text-brand-400">{education.institution}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-surface-500 dark:text-surface-400">{education.year}</span>
        {education.gpa && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">GPA: {education.gpa}</span>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50"
    >
      <p className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{project.name}</p>
      <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">{project.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400">
          {project.tech}
        </span>
        {project.link && (
          <a
            href={`https://${project.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
          >
            {project.link}
          </a>
        )}
      </div>
    </motion.div>
  );
}
