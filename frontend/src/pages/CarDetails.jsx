import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Fuel, Settings, Star } from 'lucide-react';
import carService from '../services/carService';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { toast } from 'react-toastify';

const CarDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await carService.getCar(id);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
      toast.error('Car not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate || !car) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    setBookingLoading(true);

    try {
      const bookingPayload = {
        car: id,
        ...bookingData
      };

      await bookingService.createBooking(bookingPayload);
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!car) {
    return <Navigate to="/cars" replace />;
  }

  const totalAmount = calculateTotal();
  const totalDays = totalAmount / car.pricePerDay;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Images and Details */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {car.make} {car.model} {car.year}
                </h1>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{car.seatingCapacity} Seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{car.type}</span>
                  </div>
                </div>

                {car.features && car.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {car.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{car.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Book This Car</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    ${car.pricePerDay}
                  </div>
                  <div className="text-gray-500">per day</div>
                </div>
              </div>

              {!car.available && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">
                    This car is currently not available for booking
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.startDate}
                    onChange={handleBookingChange}
                    className="input"
                    disabled={!car.available}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    value={bookingData.endDate}
                    onChange={handleBookingChange}
                    className="input"
                    disabled={!car.available}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  required
                  value={bookingData.pickupLocation}
                  onChange={handleBookingChange}
                  className="input"
                  placeholder="Enter pickup location"
                  disabled={!car.available}
                />
              </div>

              <div>
                <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  id="dropoffLocation"
                  name="dropoffLocation"
                  required
                  value={bookingData.dropoffLocation}
                  onChange={handleBookingChange}
                  className="input"
                  placeholder="Enter dropoff location"
                  disabled={!car.available}
                />
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={bookingData.specialRequests}
                  onChange={handleBookingChange}
                  className="input resize-none"
                  placeholder="Any special requests..."
                  disabled={!car.available}
                />
              </div>

              {/* Price Summary */}
              {totalAmount > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Price Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>${car.pricePerDay} × {totalDays} days</span>
                      <span>${totalAmount}</span>
                    </div>
                    <div className="border-t pt-1 font-semibold flex justify-between">
                      <span>Total Amount</span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!car.available || bookingLoading || totalAmount === 0}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <LoadingSpinner size="sm" />
                ) : !car.available ? (
                  'Not Available'
                ) : (
                  'Book Now'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;