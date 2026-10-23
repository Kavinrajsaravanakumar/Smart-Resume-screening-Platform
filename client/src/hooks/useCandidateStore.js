import { useState, useCallback, useMemo, useEffect } from 'react';
import api from '../api';

export function useCandidateStore() {
  const [candidates, setCandidates] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'all') query.append('status', params.status);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await api.get(`/candidates${qs}`);
      if (res?.data) {
        setCandidates(res.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err.message);
      setError(err.message);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const addCandidate = useCallback((candidate) => {
    setCandidates(prev => [candidate, ...prev]);
  }, []);

  const updateCandidate = useCallback(async (id, updates) => {
    try {
      if (updates.status) {
        await api.patch(`/candidates/${id}/status`, { status: updates.status });
      } else {
        await api.put(`/candidates/${id}`, updates);
      }
    } catch (err) {
      console.warn('API update failed, updating local state:', err.message);
    }
    setCandidates(prev =>
      prev.map(c => ((c.id === id || c._id === id) ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCandidate = useCallback(async (id) => {
    try {
      await api.delete(`/candidates/${id}`);
    } catch (err) {
      console.warn('API delete failed, updating local state:', err.message);
    }
    setCandidates(prev => prev.filter(c => c.id !== id && c._id !== id));
  }, []);

  const addUpload = useCallback((upload) => {
    setUploads(prev => [upload, ...prev]);
  }, []);

  const stats = useMemo(() => {
    const list = candidates || [];
    return {
      total: list.length,
      shortlisted: list.filter(c => (c.status || '').toLowerCase() === 'shortlisted').length,
      rejected: list.filter(c => (c.status || '').toLowerCase() === 'rejected').length,
      review: list.filter(c => (c.status || '').toLowerCase() === 'review' || (c.status || '').toLowerCase() === 'in review').length,
      pending: list.filter(c => (c.status || '').toLowerCase() === 'pending').length,
    };
  }, [candidates]);

  return {
    candidates,
    loading,
    error,
    uploads,
    stats,
    fetchCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addUpload,
  };
}

export default useCandidateStore;
