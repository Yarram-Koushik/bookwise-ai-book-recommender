export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/^http:\/\//i, 'https://');
};

export const formatRating = (rating) => {
  if (rating === null || rating === undefined || Number.isNaN(Number(rating))) return 'N/A';
  return Number(rating).toFixed(2);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  return Number(value).toLocaleString('en-IN');
};

export const buildBookDetailsUrl = (title) => `/book?title=${encodeURIComponent(title)}`;
