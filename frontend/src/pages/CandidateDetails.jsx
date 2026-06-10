import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { fetchCandidate, fetchCandidateResume } from '../api/candidates';
import LoadingState from '../components/LoadingState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      try {
        const result = await fetchCandidate(id);
        setCandidate(result.data);
        const resume = await fetchCandidateResume(id);
        setResumeUrl(resume.url);
      } catch {
        setCandidate(null);
      } finally {
        setLoading(false);
      }
    }

    loadCandidate();
  }, [id]);

  if (loading) return <LoadingState label="Loading candidate profile" />;
  if (!candidate) return <div className="empty-state">Candidate not found.</div>;

  const skills = candidate.skillGroups || {};
  const education = candidate.educationDetails || {};
  const achievements = candidate.achievements || {};
  const additionalInfo = candidate.additionalInfo || {};
  const scoreBreakdown = candidate.scoreBreakdown || {};

  function renderList(items, empty = 'Not available') {
    return items?.length ? items.map((item) => <li key={typeof item === 'string' ? item : JSON.stringify(item)}>{item}</li>) : <li>{empty}</li>;
  }

  function renderLink(label, url) {
    if (!url) return <span>Not provided</span>;
    return <a href={url} target="_blank" rel="noreferrer">{label} <ExternalLink size={14} /></a>;
  }

  return (
    <section className="page-stack">
      <Link className="back-link" to="/candidates"><ArrowLeft size={17} /> Back to candidates</Link>
      <header className="candidate-profile">
        <div>
          <p className="eyebrow">Candidate profile</p>
          <h1>{candidate.fullName || candidate.name}</h1>
          <div className="contact-row">
            <span><Mail size={16} /> {candidate.email}</span>
            <span><Phone size={16} /> {candidate.phone}</span>
            {candidate.location && <span><MapPin size={16} /> {candidate.location}</span>}
          </div>
        </div>
        <StatusBadge score={candidate.rankingScore} />
      </header>

      <div className="profile-links">
        <span>LinkedIn: {renderLink('Profile', candidate.linkedIn)}</span>
        <span>GitHub: {renderLink('Repository', candidate.github)}</span>
        <span>Portfolio: {renderLink('Website', candidate.portfolio)}</span>
      </div>

      <div className="detail-section">
        <h2>Summary</h2>
        <p>{candidate.summary || 'No summary extracted from the resume.'}</p>
      </div>

      <div className="score-grid">
        {Object.entries(scoreBreakdown).map(([label, value]) => (
          <article key={label}>
            <span>{label.replace(/([A-Z])/g, ' $1')}</span>
            <strong>{value || 0}%</strong>
          </article>
        ))}
      </div>

      <div className="detail-grid expanded">
        <article>
          <h2>Education</h2>
          <dl className="info-list">
            <dt>Degree</dt><dd>{education.degree || candidate.education || 'Not specified'}</dd>
            <dt>Department</dt><dd>{education.department || 'Not specified'}</dd>
            <dt>College</dt><dd>{education.college || 'Not specified'}</dd>
            <dt>CGPA</dt><dd>{education.cgpa || 'Not specified'}</dd>
            <dt>Start Year</dt><dd>{education.startYear || 'Not specified'}</dd>
            <dt>End Year</dt><dd>{education.endYear || 'Not specified'}</dd>
          </dl>
        </article>

        <article>
          <h2>Skills</h2>
          {[
            ['Programming Languages', skills.programmingLanguages],
            ['Frameworks', skills.frameworks],
            ['Databases', skills.databases],
            ['Cloud Technologies', skills.cloudTechnologies],
            ['DevOps Tools', skills.devOpsTools],
            ['Soft Skills', skills.softSkills]
          ].map(([group, values]) => (
            <div className="skill-group" key={group}>
              <strong>{group}</strong>
              <div className="skill-list">
                {(values?.length ? values : ['Not detected']).map((skill) => <span key={`${group}-${skill}`}>{skill}</span>)}
              </div>
            </div>
          ))}
        </article>

        <article className="wide-card">
          <h2>Projects</h2>
          <div className="record-list">
            {(candidate.projects || []).length ? candidate.projects.map((project) => (
              <div key={`${project.projectName}-${project.description}`}>
                <h3>{project.projectName || 'Project'}</h3>
                <p>{project.description}</p>
                <p><strong>Technologies:</strong> {project.technologies?.join(', ') || 'Not specified'}</p>
                <p><strong>GitHub:</strong> {renderLink('Open', project.githubLink)}</p>
                <p><strong>Live Demo:</strong> {renderLink('Open', project.liveDemo)}</p>
                <p><strong>Duration:</strong> {project.duration || 'Not specified'}</p>
                <p><strong>Role:</strong> {project.role || 'Not specified'}</p>
              </div>
            )) : <p>No projects extracted.</p>}
          </div>
        </article>

        <article className="wide-card">
          <h2>Experience</h2>
          <div className="record-list">
            {(candidate.experienceDetails || []).length ? candidate.experienceDetails.map((experience) => (
              <div key={`${experience.company}-${experience.responsibilities}`}>
                <h3>{experience.jobTitle || 'Experience'}</h3>
                <p><strong>Company:</strong> {experience.company || 'Not specified'}</p>
                <p><strong>Duration:</strong> {experience.duration || `${candidate.experience || 0} years`}</p>
                <p><strong>Responsibilities:</strong> {experience.responsibilities}</p>
              </div>
            )) : <p>{candidate.experience || 0} years</p>}
          </div>
        </article>

        <article className="wide-card">
          <h2>Certifications</h2>
          <div className="record-list">
            {(candidate.certifications || []).length ? candidate.certifications.map((certification) => (
              <div key={`${certification.certificationName}-${certification.date}`}>
                <h3>{certification.certificationName}</h3>
                <p><strong>Issuer:</strong> {certification.issuer || 'Not specified'}</p>
                <p><strong>Date:</strong> {certification.date || 'Not specified'}</p>
                <p><strong>Credential:</strong> {renderLink('Open', certification.credentialUrl)}</p>
              </div>
            )) : <p>No certifications extracted.</p>}
          </div>
        </article>

        <article>
          <h2>Achievements</h2>
          <h3>Awards</h3><ul>{renderList(achievements.awards)}</ul>
          <h3>Hackathons</h3><ul>{renderList(achievements.hackathons)}</ul>
          <h3>Publications</h3><ul>{renderList(achievements.publications)}</ul>
          <h3>Scholarships</h3><ul>{renderList(achievements.scholarships)}</ul>
        </article>

        <article>
          <h2>Additional Information</h2>
          <h3>Languages</h3><ul>{renderList(additionalInfo.languages)}</ul>
          <h3>Volunteer Work</h3><ul>{renderList(additionalInfo.volunteerWork)}</ul>
          <h3>Extracurricular Activities</h3><ul>{renderList(additionalInfo.extracurricularActivities)}</ul>
        </article>

        <article className="wide-card">
          <h2>Resume</h2>
          {resumeUrl
            ? renderLink('View resume', resumeUrl)
            : <p>Resume file is not available.</p>}
        </article>
      </div>
    </section>
  );
}
