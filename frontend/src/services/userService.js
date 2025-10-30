import api from './api';

const userService = {
  getUsers: () => 
    api.get('/users'),

  getUser: (id) => 
    api.get(`/users/${id}`),

  updateUser: (id, userData) => 
    api.put(`/users/${id}`, userData),

  deleteUser: (id) => 
    api.delete(`/users/${id}`),
};

export default userService;