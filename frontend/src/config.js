const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
export const API_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
