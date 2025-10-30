import api from './api';

const bookingService = {
  createBooking: (bookingData) => 
    api.post('/bookings', bookingData),

  getMyBookings: () => 
    api.get('/bookings/mybookings'),

  getAllBookings: () => 
    api.get('/bookings'),

  getBooking: (id) => 
    api.get(`/bookings/${id}`),

  cancelBooking: (id) => 
    api.put(`/bookings/${id}/cancel`),

  deleteBooking: (id) => 
    api.delete(`/bookings/${id}`),
};

export default bookingService;