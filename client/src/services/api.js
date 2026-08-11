// ============================================================
// src/services/api.js - Axios API Client
// ============================================================
// This is the central place for all API calls to our backend.
// Axios automatically adds the auth token to every request.
// ============================================================

import axios from 'axios';

// Create an axios instance pointing to our backend
const api = axios.create({
  baseURL: '/api', // Vite proxy forwards this to http://localhost:5000/api
});

// --- Request Interceptor ---
// Before every API call, automatically attach the JWT token if it exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response Interceptor ---
// If the server returns 401 (token expired/invalid), log the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
