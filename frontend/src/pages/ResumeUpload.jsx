import { useState } from 'react';
import { CheckCircle2, FileUp, Loader2 } from 'lucide-react';
import { uploadResume } from '../api/candidates';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [requiredSkills, setRequiredSkills] = useState('Java, AWS, Docker, Kubernetes');
  const [status, setStatus] = useState({ type: 'idle', message: 'Choose a resume to begin.' });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please choose a PDF or DOCX resume.' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('requiredSkills', requiredSkills);

    setStatus({ type: 'loading', message: 'Uploading and extracting candidate data...' });
    try {
      const result = await uploadResume(formData);
      setStatus({ type: 'success', message: `${result.data.fullName || result.data.name} uploaded with ${result.data.rankingScore}% match.` });
      setFile(null);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Upload failed. Please try again.' });
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Resume processing</p>
        <h1>Upload Resume</h1>
        <p>Extract contact details, skills, education, experience, and calculate a match score.</p>
      </header>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="file-drop">
          <FileUp size={34} />
          <strong>{file ? file.name : 'Select PDF or DOCX file'}</strong>
          <span>Maximum file size is 5 MB.</span>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <label className="field">
          <span>Required skills</span>
          <input value={requiredSkills} onChange={(event) => setRequiredSkills(event.target.value)} placeholder="Java, AWS, Docker" />
        </label>

        <button className="button primary" type="submit" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? <Loader2 className="spin" size={18} /> : <CheckCircle2 size={18} />}
          Process resume
        </button>

        <div className={`upload-status ${status.type}`}>{status.message}</div>
      </form>
    </section>
  );
}
