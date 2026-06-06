import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export const getHealth = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const searchBooks = async (query, limit = 8) => {
  const response = await api.get('/search', {
    params: { query, limit },
  });
  return response.data;
};

export const getPopularBooks = async (limit = 20) => {
  const response = await api.get('/popular', {
    params: { limit },
  });
  return response.data;
};

export const getBooks = async (limit = 50) => {
  const response = await api.get('/books', {
    params: { limit },
  });
  return response.data;
};

export const recommendBooks = async (title, topN = 8) => {
  const response = await api.post('/recommend', {
    title,
    top_n: topN,
  });
  return response.data;
};

export const getBookDetails = async (title) => {
  const response = await api.get('/book', {
    params: { title },
  });
  return response.data;
};

export default api;
