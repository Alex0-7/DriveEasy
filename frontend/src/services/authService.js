import api from './api';

const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),  // ✅ /auth/login (not /api/auth/login)

  register: (userData) => 
    api.post('/auth/register', userData),          // ✅ /auth/register

  getMe: () => 
    api.get('/auth/me')                            // ✅ /auth/me
};

export default authService;