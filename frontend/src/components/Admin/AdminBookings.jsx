import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, MapPin, DollarSign } from 'lucide-react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../Common/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeletingId(bookingId);
    try {
      await bookingService.deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size="xl" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <div className="text-sm text-gray-500">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Booking Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.car.make} {booking.car.model} {booking.car.year}
                    </h3>
                    <p className="text-gray-600">
                      Booked by {booking.user.name} ({booking.user.email})
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="text-sm font-medium">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-sm font-medium">${booking.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup</p>
                      <p className="text-sm font-medium">{booking.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Dropoff</p>
                      <p className="text-sm font-medium">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                    <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4 lg:mt-0 lg:ml-4">
                <button
                  onClick={() => handleDelete(booking._id)}
                  disabled={deletingId === booking._id}
                  className="btn btn-danger disabled:opacity-50"
                >
                  {deletingId === booking._id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;