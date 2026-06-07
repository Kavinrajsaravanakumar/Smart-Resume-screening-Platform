import api from './client';

export async function registerHr(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function loginHr(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function fetchCurrentHr() {
  const { data } = await api.get('/auth/me');
  return data;
}

export function saveSession({ token, user }) {
  localStorage.setItem('hrToken', token);
  localStorage.setItem('hrUser', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('hrToken');
  localStorage.removeItem('hrUser');
}

export function getSession() {
  const token = localStorage.getItem('hrToken');
  const user = localStorage.getItem('hrUser');
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
}
