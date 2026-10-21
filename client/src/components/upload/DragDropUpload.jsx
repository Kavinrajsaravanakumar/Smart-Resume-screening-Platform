import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, X, CloudUpload } from 'lucide-react';

export default function DragDropUpload({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const simulateUpload = useCallback((newFiles) => {
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f =>
            f.file === file ? { ...f, status: 'complete', progress: 100 } : f
          ));
          onUpload?.(file);
        } else {
          setFiles(prev => prev.map(f =>
            f.file === file ? { ...f, progress: Math.min(progress, 99) } : f
          ));
        }
      }, 300);
    });
  }, [onUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'));
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles.map(f => ({ file: f, status: 'uploading', progress: 0 }))]);
      simulateUpload(droppedFiles);
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files).filter(f => f.name.endsWith('.pdf'));
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles.map(f => ({ file: f, status: 'uploading', progress: 0 }))]);
      simulateUpload(selectedFiles);
    }
  }, [simulateUpload]);

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragOver
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
            : 'border-surface-300 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-surface-50 dark:hover:bg-surface-800/50'
          }
        `}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <motion.div
          animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4"
        >
          <CloudUpload className={`w-8 h-8 ${isDragOver ? 'text-brand-600 dark:text-brand-400' : 'text-brand-500'}`} />
        </motion.div>
        <p className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
          {isDragOver ? 'Drop your resumes here' : 'Drag & drop resumes here'}
        </p>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
          or click to browse files
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500">
          Supports PDF files up to 10MB
        </p>
      </motion.div>

      <AnimatePresence>
        {files.map(({ file, status, progress }, idx) => (
          <motion.div
            key={`${file.name}-${idx}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                status === 'complete'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'bg-brand-100 dark:bg-brand-900/30'
              }`}>
                {status === 'complete' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {(file.size / 1024).toFixed(0)} KB
                  {status === 'complete' && ' \u00b7 Parsed successfully'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(file); }}
                className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {status === 'uploading' && (
              <div className="mt-3">
                <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-brand rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
