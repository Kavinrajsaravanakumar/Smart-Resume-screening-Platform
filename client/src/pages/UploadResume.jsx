import { motion } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';
import DragDropUpload from '../components/upload/DragDropUpload.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useState } from 'react';

export default function UploadResume() {
  const [uploadCount, setUploadCount] = useState(0);

  const handleUpload = () => {
    setUploadCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Resumes"
        description="Upload PDF resumes to be parsed and ranked by our AI engine"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6" hover={false}>
            <DragDropUpload onUpload={handleUpload} />
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4">Upload Guidelines</h3>
            <div className="space-y-3">
              {[
                { icon: FileText, text: 'PDF format only', desc: 'Maximum 10MB per file' },
                { icon: CheckCircle, text: 'AI-powered parsing', desc: 'Automatic skill extraction' },
                { icon: CheckCircle, text: 'Auto-ranking', desc: 'Scored against job requirements' },
              ].map(({ icon: Icon, text, desc }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{text}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3">This Session</h3>
            <div className="text-center p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20">
              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{uploadCount}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Resumes uploaded</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3">How It Works</h3>
            <div className="space-y-2">
              {[
                '1. Upload your PDF resume',
                '2. AI extracts key information',
                '3. Candidate profile is created',
                '4. Resume is scored and ranked',
              ].map((step, i) => (
                <p key={i} className="text-xs text-surface-600 dark:text-surface-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-[10px] font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                    {i + 1}
                  </span>
                  {step.replace(/^\d+\.\s/, '')}
                </p>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
