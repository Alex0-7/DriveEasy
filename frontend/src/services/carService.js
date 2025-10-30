import api from './api';

const carService = {
  getCars: (params = {}) => 
    api.get('/cars', { params }),

  getCar: (id) => 
    api.get(`/cars/${id}`),

  createCar: (carData) => 
    api.post('/cars', carData),

  updateCar: (id, carData) => 
    api.put(`/cars/${id}`, carData),

  deleteCar: (id) => 
    api.delete(`/cars/${id}`),
};

export default carService;