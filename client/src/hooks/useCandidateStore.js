import { useState, useCallback, useMemo } from 'react';
import { mockCandidates } from '../data/mockCandidates';
import { mockUploads } from '../data/mockUploads';

export function useCandidateStore() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [uploads, setUploads] = useState(mockUploads);

  const addCandidate = useCallback((candidate) => {
    setCandidates(prev => [candidate, ...prev]);
  }, []);

  const updateCandidate = useCallback((id, updates) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCandidate = useCallback((id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }, []);

  const addUpload = useCallback((upload) => {
    setUploads(prev => [upload, ...prev]);
  }, []);

  const stats = useMemo(() => ({
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
    review: candidates.filter(c => c.status === 'review').length,
    pending: candidates.filter(c => c.status === 'pending').length,
  }), [candidates]);

  return {
    candidates,
    uploads,
    stats,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addUpload,
  };
}
