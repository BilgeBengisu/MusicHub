// API base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API endpoints
const endpoints = {
  login: `${API_BASE_URL}/auth/token/login/`,
  logout: `${API_BASE_URL}/auth/token/logout/`,
  register: `${API_BASE_URL}/auth/users/`,
  profile: `${API_BASE_URL}/users/profile/`,
  updateProfile: `${API_BASE_URL}/users/profile/update/`,
  posts: `${API_BASE_URL}/posts/`,
};

export default endpoints; 