const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
  const token = localStorage.getItem('srs-auth-token');
  if (token) return token;
  try {
    const user = JSON.parse(localStorage.getItem('srs-auth-user') || '{}');
    return user.token || null;
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type only if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || data || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  patch: (endpoint, body, options) =>
    request(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  upload: (endpoint, formData, options) =>
    request(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    }),
  getBlob: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = getToken();
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, method: 'GET', headers });
    if (!response.ok) {
      let errText = '';
      try {
        const json = await response.json();
        errText = json.message;
      } catch {
        errText = await response.text();
      }
      throw new Error(errText || `Failed to fetch file (status: ${response.status})`);
    }
    return await response.blob();
  },
};

export default api;
