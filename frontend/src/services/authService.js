import api from './api';

const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post('/auth/register', userData),

  getMe: () => 
    api.get('/auth/me'),
};

export default authService;