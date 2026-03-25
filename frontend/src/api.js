import axios from 'axios';

let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

if (apiBaseUrl && apiBaseUrl.startsWith('@react_app_api_url')) {
  console.warn('REACT_APP_API_URL placeholder detected - falling back to hardcoded production API URL');
  apiBaseUrl = 'https://charity-app-3fwv.onrender.com/api';
}

if (!process.env.REACT_APP_API_URL || apiBaseUrl === 'http://localhost:5000/api') {
  console.warn('REACT_APP_API_URL is not configured; defaulting to http://localhost:5000/api');
}

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!config.baseURL) throw new Error('API baseURL is missing');
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
