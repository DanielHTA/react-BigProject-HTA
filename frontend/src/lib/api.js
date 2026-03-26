const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nd_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Errore di rete');
  return data;
}

// --- AUTH ---
export const authApi = {
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request('/auth/me'),
};

// --- NEWS ---
export const newsApi = {
  getHeadlines: (category = '', q = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'tutte') params.set('category', category);
    if (q) params.set('q', q);
    return request(`/news?${params.toString()}`);
  },

  getWeather: (city = 'Torino') =>
    request(`/news/weather?city=${encodeURIComponent(city)}`),
};

// --- SAVED ---
export const savedApi = {
  getAll: () => request('/saved'),

  save: (article) =>
    request('/saved', {
      method: 'POST',
      body: JSON.stringify(article),
    }),

  remove: (id) =>
    request(`/saved/${id}`, { method: 'DELETE' }),
};
