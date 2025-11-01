import api from './api';

const authService = {
login: (email, password) => api.post('/auth/login', { email, password }),
register: (userData) => api.post('/auth/register', userData),

// bookingService.js  
createBooking: (bookingData) => api.post('/bookings', bookingData),
getMyBookings: () => api.get('/bookings/mybookings')
};

export default authService;