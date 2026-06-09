import api from './client';

export async function fetchCandidates(params = {}) {
  const { data } = await api.get('/candidates', { params });
  return data;
}

export async function fetchCandidate(id) {
  const { data } = await api.get(`/candidates/${id}`);
  return data;
}

export async function deleteCandidate(id) {
  const { data } = await api.delete(`/candidates/${id}`);
  return data;
}

export async function uploadResume(formData) {
  const { data } = await api.post('/resumes/upload', formData);
  return data;
}

export async function fetchDashboardStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}
