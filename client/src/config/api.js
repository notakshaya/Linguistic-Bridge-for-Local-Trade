// API configuration for different environments
const getApiUrl = () => {
  // In production, use environment variable or fallback to production URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://linguatrade-backend.up.railway.app';
  }
  
  // In development, use local server
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiUrl();
export const SOCKET_URL = API_BASE_URL;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  VENDORS: {
    LIST: '/api/vendors',
    SEARCH: '/api/vendors/search',
    DETAIL: (id) => `/api/vendors/${id}`
  },
  NEGOTIATIONS: {
    CREATE: '/api/negotiations',
    DETAIL: (id) => `/api/negotiations/${id}`,
    OFFERS: (id) => `/api/negotiations/${id}/offers`
  },
  TRANSLATE: {
    TEXT: '/api/translate',
    LANGUAGES: '/api/translate/languages',
    PHRASES: (category) => `/api/translate/phrases/${category}`
  },
  PRICING: {
    DISCOVER: '/api/pricing/discover',
    TRENDS: (category) => `/api/pricing/trends/${category}`,
    COMPETITIVE: '/api/pricing/competitive-analysis'
  }
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_ENDPOINTS
};