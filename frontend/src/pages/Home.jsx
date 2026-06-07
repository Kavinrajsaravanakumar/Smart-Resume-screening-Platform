import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, SlidersHorizontal, UploadCloud } from 'lucide-react';

export default function Home() {
  return (
    <section className="home-grid">
      <div className="home-copy">
        <p className="eyebrow">Enterprise HR automation</p>
        <h1>Smart Resume Screening Platform</h1>
        <p className="lead">
          Upload resumes, extract candidate profiles, rank skills against job requirements, and give recruiters a clean hiring dashboard.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/upload">
            <UploadCloud size={18} />
            Upload resumes
          </Link>
          <Link className="button secondary" to="/dashboard">
            View dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <div className="home-panel">
        <div className="process-step">
          <UploadCloud />
          <div>
            <strong>Resume intake</strong>
            <span>PDF and DOCX files are accepted with guarded validation.</span>
          </div>
        </div>
        <div className="process-step">
          <SlidersHorizontal />
          <div>
            <strong>Skill scoring</strong>
            <span>Required skills become a transparent ranking score.</span>
          </div>
        </div>
        <div className="process-step">
          <ShieldCheck />
          <div>
            <strong>Cloud-ready design</strong>
            <span>Prepared for AWS, containers, Kubernetes, CI/CD, and observability.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
